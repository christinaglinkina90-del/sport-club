import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../src/users/users.module';
import { UserSaveDto } from '../../src/users/dto/user.save-dto';
import request, { Response } from 'supertest';
import { Role } from '../../src/users/enums/role.enum';
import { UserUpdateDto } from '../../src/users/dto/user.update-dto';
import { EmailService } from '../../src/email/email.service';
import { ConfirmationCode } from '../../src/confirmation-codes/confirmation-code.entity';
import * as bcrypt from 'bcrypt';

describe('UsersController (IT)', (): void => {
  const RESOURCE_NAME: string = '/users';

  const VALID_SAVE_DTO: UserSaveDto = {
    email: 'user@test.com',
    password: 'TestUserPass1',
    name: 'User Name',
    phone: '+491700000010',
  };

  const VALID_SAVE_DTO_WITH_INCORRECT_EMAIL: UserSaveDto = {
    email: 'usertest.com',
    password: 'TestUserPass1',
    name: 'User Name',
    phone: '+491700000011',
  };

  const VALID_UPDATE_DTO: UserUpdateDto = {
    newName: 'New User Name',
  };

  const UPDATE_DTO_WITH_INCORRECT_NAME: UserUpdateDto = {
    newName: 'New Us#er Name',
  };

  let app: INestApplication;
  let httpServer: any;
  let repository: Repository<User>;
  let codesRepository: Repository<ConfirmationCode>;

  const emailService: { sendConfirmationEmail: ReturnType<typeof vi.fn> } = {
    sendConfirmationEmail: vi.fn(),
  };

  let activeUser: User;
  let inactiveUser: User;

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.getOrThrow<string>('DB_HOST'),
            port: Number(configService.getOrThrow<string>('DB_PORT')),
            username: configService.getOrThrow<string>('DB_USERNAME'),
            password: configService.getOrThrow<string>('DB_PASSWORD'),
            database: configService.get<string>(
              'TEST_DB_DATABASE',
              'sport_club_test',
            ),
            autoLoadEntities: true,
            synchronize: true,
          }),
        }),
        UsersModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(emailService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    httpServer = app.getHttpServer();
    repository = module.get(getRepositoryToken(User));
    codesRepository = module.get(getRepositoryToken(ConfirmationCode));
  });

  beforeEach(async (): Promise<void> => {
    emailService.sendConfirmationEmail.mockClear();

    activeUser = new User();
    activeUser.email = 'active@test.com';
    activeUser.password = 'ActiveUserPass1';
    activeUser.name = 'Active User Name';
    activeUser.phone = '+491700000001';
    activeUser.role = Role.CLIENT;
    activeUser.active = true;

    inactiveUser = new User();
    inactiveUser.email = 'inactive@test.com';
    inactiveUser.password = 'InactiveUserPass1';
    inactiveUser.name = 'Inactive User Name';
    inactiveUser.phone = '+491700000002';
    inactiveUser.role = Role.CLIENT;
    inactiveUser.active = false;

    await repository.save([activeUser, inactiveUser]);
  });

  afterEach(async (): Promise<void> => {
    await codesRepository.deleteAll();
    await repository.deleteAll();
  });

  afterAll(async (): Promise<void> => {
    await app.close();
  });

  describe('create', (): void => {
    it('should create user', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(RESOURCE_NAME)
        .send(VALID_SAVE_DTO)
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
      expect(response.body.password).toBeUndefined();
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: VALID_SAVE_DTO.name,
          role: Role.CLIENT,
        }),
      );

      const savedUser: User | null = await repository.findOneBy({
        id: response.body.id,
      });

      expect(savedUser).toBeDefined();
      expect(savedUser).toEqual(
        expect.objectContaining({
          email: VALID_SAVE_DTO.email,
          name: VALID_SAVE_DTO.name,
          phone: VALID_SAVE_DTO.phone,
          role: Role.CLIENT,
          active: true,
        }),
      );
      // В БД пароль хранится в зашифрованном виде,
      // поэтому сравниваем его через bcrypt, а не напрямую.
      expect(
        await bcrypt.compare(VALID_SAVE_DTO.password, savedUser!.password),
      ).toBe(true);
    });

    it('should return 400 if email is incorrect', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(RESOURCE_NAME)
        .send(VALID_SAVE_DTO_WITH_INCORRECT_EMAIL)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('email')]),
      );
    });

    it('should return 409 if phone already exists', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(RESOURCE_NAME)
        .send({ ...VALID_SAVE_DTO, phone: activeUser.phone })
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toContain('phone already exists');
    });
  });

  describe('getById', (): void => {
    it('should return user', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .get(`${RESOURCE_NAME}/${activeUser.id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.password).toBeUndefined();
      expect(response.body).toEqual(
        expect.objectContaining({
          id: activeUser.id,
          name: activeUser.name,
          role: activeUser.role,
        }),
      );
    });

    it('should return 404 if inactive user is requested', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .get(`${RESOURCE_NAME}/${inactiveUser.id}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toContain('not found');
    });
  });

  describe('update', (): void => {
    it('should update user name', async (): Promise<void> => {
      await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}`)
        .send(VALID_UPDATE_DTO)
        .expect(HttpStatus.NO_CONTENT);

      const updatedUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser).toEqual(
        expect.objectContaining({
          email: activeUser.email,
          password: activeUser.password,
          name: VALID_UPDATE_DTO.newName,
          role: Role.CLIENT,
          active: true,
        }),
      );
    });

    it('should return 400 if new user name is incorrect', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}`)
        .send(UPDATE_DTO_WITH_INCORRECT_NAME)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('Name')]),
      );

      const existingUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(existingUser).toBeDefined();
      expect(existingUser).toEqual(
        expect.objectContaining({
          email: activeUser.email,
          password: activeUser.password,
          name: activeUser.name,
          role: Role.CLIENT,
          active: true,
        }),
      );
    });
  });

  describe('deleteById and restoreById', (): void => {
    it('should mark user as inactive', async (): Promise<void> => {
      await request(httpServer)
        .delete(`${RESOURCE_NAME}/${activeUser.id}`)
        .expect(HttpStatus.NO_CONTENT);

      const deletedUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(deletedUser).toBeDefined();
      expect(deletedUser!.active).toBe(false);
    });

    it('should mark inactive user as active', async (): Promise<void> => {
      await request(httpServer)
        .patch(`${RESOURCE_NAME}/${inactiveUser.id}/restore`)
        .expect(HttpStatus.NO_CONTENT);

      const restoredUser: User | null = await repository.findOneBy({
        id: inactiveUser.id,
      });

      expect(restoredUser).toBeDefined();
      expect(restoredUser!.active).toBe(true);
    });
  });

  describe('setRole', (): void => {
    it('should set new role', async (): Promise<void> => {
      await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}/set-role/${Role.TRAINER}`)
        .expect(HttpStatus.NO_CONTENT);

      const updatedUser: User | null = await repository.findOneBy({
        id: activeUser.id,
      });

      expect(updatedUser!.role).toEqual(Role.TRAINER);
    });

    it('should return 400 if role is unknown', async (): Promise<void> => {
      await request(httpServer)
        .patch(`${RESOURCE_NAME}/${activeUser.id}/set-role/AGENT`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('register and confirm', (): void => {
    it('should register inactive user and send confirmation email', async (): Promise<void> => {
      await request(httpServer)
        .post(`${RESOURCE_NAME}/register`)
        .send(VALID_SAVE_DTO)
        .expect(HttpStatus.OK);

      const registeredUser: User | null = await repository.findOneBy({
        email: VALID_SAVE_DTO.email,
      });

      expect(registeredUser).toEqual(
        expect.objectContaining({
          name: VALID_SAVE_DTO.name,
          role: Role.CLIENT,
          active: false,
        }),
      );
      expect(emailService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if email belongs to active user', async (): Promise<void> => {
      const response: Response = await request(httpServer)
        .post(`${RESOURCE_NAME}/register`)
        .send({ ...VALID_SAVE_DTO, email: activeUser.email })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('already in use');
      expect(emailService.sendConfirmationEmail).not.toHaveBeenCalled();
    });

    it('should activate user with valid confirmation code', async (): Promise<void> => {
      const code: ConfirmationCode = new ConfirmationCode();
      code.value = 'test-confirmation-code';
      code.expiration = new Date(Date.now() + 60 * 60 * 1000);
      code.user = inactiveUser;
      await codesRepository.save(code);

      await request(httpServer)
        .get(`${RESOURCE_NAME}/confirm/${code.value}`)
        .expect(HttpStatus.OK);

      const confirmedUser: User | null = await repository.findOneBy({
        id: inactiveUser.id,
      });

      expect(confirmedUser!.active).toBe(true);
      expect(await codesRepository.countBy({ value: code.value })).toEqual(0);
    });

    it('should return 400 if confirmation code is expired', async (): Promise<void> => {
      const code: ConfirmationCode = new ConfirmationCode();
      code.value = 'expired-confirmation-code';
      code.expiration = new Date(Date.now() - 60 * 1000);
      code.user = inactiveUser;
      await codesRepository.save(code);

      const response: Response = await request(httpServer)
        .get(`${RESOURCE_NAME}/confirm/${code.value}`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('invalid');
    });
  });
});
