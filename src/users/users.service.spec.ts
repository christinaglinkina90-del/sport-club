import { Mocked } from 'vitest';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersMapper } from './dto/users.mapper';
import { UsersValidator } from './validation/users.validator';
import { EmailService } from '../email/email.service';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { UserSaveDto } from './dto/user.save-dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { User } from './user.entity';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { UserUpdateDto } from './dto/user.update-dto';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';
import { RegistrationException } from '../exceptions/types/registration.exception';
import * as bcrypt from 'bcrypt';

describe('UsersService', (): void => {
  const VALID_SAVE_DTO: UserSaveDto = {
    email: 'user1@test.com',
    password: 'UserPass1',
    name: 'User1',
    phone: '+491700000001',
  };

  const VALID_SAVE_DTO_WITH_EXISTING_EMAIL: UserSaveDto = {
    email: 'admin@test.com',
    password: 'AdminPass1',
    name: 'Admin',
    phone: '+491700000009',
  };

  const VALID_SAVE_DTO_WITH_EXISTING_PHONE: UserSaveDto = {
    email: 'user3@test.com',
    password: 'UserPass3',
    name: 'User3',
    phone: '+491700000000',
  };

  const VALID_UPDATE_DTO: UserUpdateDto = {
    newName: 'New User Name',
  };

  let validEntity1: User;
  let validEntity2: User;

  let service: UsersService;
  let repository: Mocked<UsersRepository>;
  let emailService: Mocked<EmailService>;

  beforeEach(async (): Promise<void> => {
    validEntity1 = {
      id: 1,
      email: 'user1@test.com',
      password: 'UserPass1',
      name: 'User1',
      phone: '+491700000001',
      role: Role.CLIENT,
      active: true,
    };

    validEntity2 = {
      id: 2,
      email: 'user2@test.com',
      password: 'UserPass2',
      name: 'User2',
      phone: '+491700000002',
      role: Role.TRAINER,
      active: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersMapper,
        UsersValidator,
        {
          provide: UsersRepository,
          useValue: {
            save: vi.fn(),
            findAllActive: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            findByPhone: vi.fn(),
            isEmailExists: vi.fn(),
            isPhoneExists: vi.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendConfirmationEmail: vi.fn(),
          },
        },
        {
          provide: ConfirmationCodesService,
          useValue: {
            validateCodeAndGetUser: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UsersRepository);
    emailService = module.get(EmailService);

    repository.isEmailExists.mockImplementation(
      async (email: string): Promise<boolean> => {
        return email === 'admin@test.com';
      },
    );

    repository.isPhoneExists.mockImplementation(
      async (phone: string): Promise<boolean> => {
        return phone === '+491700000000';
      },
    );

    repository.findAllActive.mockResolvedValue([validEntity1, validEntity2]);

    repository.save.mockImplementation(async (entity: User): Promise<User> => {
      if (!entity.id) {
        entity.id = 100;
      }
      return entity;
    });

    repository.findById.mockImplementation(
      async (id: number): Promise<User | null> => {
        if (id === 1) {
          return validEntity1;
        }

        if (id === 2) {
          return validEntity2;
        }

        return null;
      },
    );
  });

  describe('create', (): void => {
    it('should create active client and return dto', async (): Promise<void> => {
      const result: UserDto = await service.create(VALID_SAVE_DTO);

      expect(result).toBeDefined();
      expect(result.name).toEqual(VALID_SAVE_DTO.name);
      expect(result.role).toEqual(Role.CLIENT);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: Role.CLIENT, active: true }),
      );
    });

    it('should save hashed password', async (): Promise<void> => {
      await service.create(VALID_SAVE_DTO);

      const savedUser: User = repository.save.mock.calls[0][0];
      expect(savedUser.password).not.toEqual(VALID_SAVE_DTO.password);
      expect(
        await bcrypt.compare(VALID_SAVE_DTO.password, savedUser.password),
      ).toBe(true);
    });

    it('should throw error if email already exists', async (): Promise<void> => {
      const resultPromise: Promise<UserDto> = service.create(
        VALID_SAVE_DTO_WITH_EXISTING_EMAIL,
      );

      await expect(resultPromise).rejects.toThrow('already exists');
      await expect(resultPromise).rejects.toBeInstanceOf(EntitySaveException);
    });

    it('should throw error if phone already exists', async (): Promise<void> => {
      const resultPromise: Promise<UserDto> = service.create(
        VALID_SAVE_DTO_WITH_EXISTING_PHONE,
      );

      await expect(resultPromise).rejects.toThrow('phone already exists');
      await expect(resultPromise).rejects.toBeInstanceOf(EntitySaveException);
    });
  });

  describe('getAllActiveUsers', (): void => {
    it('should return list of user DTOs', async (): Promise<void> => {
      const result: UserDto[] = await service.getAllActiveUsers();

      expect(result).toBeDefined();
      expect(result.length).toEqual(2);

      const dto1: UserDto = result[0];
      expect(dto1).toBeDefined();
      expect(dto1.id).toEqual(validEntity1.id);
      expect(dto1.name).toEqual(validEntity1.name);
      expect(dto1.role).toEqual(validEntity1.role);

      const dto2: UserDto = result[1];
      expect(dto2).toBeDefined();
      expect(dto2.id).toEqual(validEntity2.id);
      expect(dto2.name).toEqual(validEntity2.name);
      expect(dto2.role).toEqual(validEntity2.role);
    });

    it('should throw error if list of users is empty', async (): Promise<void> => {
      repository.findAllActive.mockResolvedValue([]);
      const resultPromise: Promise<UserDto[]> = service.getAllActiveUsers();

      await expect(resultPromise).rejects.toThrow('not a single');
      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should update user name', async (): Promise<void> => {
      const idToUpdate: number = 1;
      await service.update(idToUpdate, VALID_UPDATE_DTO);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: idToUpdate,
          name: VALID_UPDATE_DTO.newName,
        }),
      );
    });

    it('should throw exception when user is not found', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.update(
        1000,
        VALID_UPDATE_DTO,
      );

      await expect(resultPromise).rejects.toThrow('not found');
      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe('deleteById and restoreById', (): void => {
    it('should mark user as inactive', async (): Promise<void> => {
      await service.deleteById(1);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, active: false }),
      );
    });

    it('should mark inactive user as active', async (): Promise<void> => {
      validEntity1.active = false;
      await service.restoreById(1);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, active: true }),
      );
    });
  });

  describe('setRole', (): void => {
    it('should set new role', async (): Promise<void> => {
      await service.setRole(1, Role.TRAINER);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, role: Role.TRAINER }),
      );
    });

    it('should throw exception when user already has the role', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.setRole(2, Role.TRAINER);

      await expect(resultPromise).rejects.toThrow('already has role');
      await expect(resultPromise).rejects.toBeInstanceOf(EntityUpdateException);
    });
  });

  describe('register', (): void => {
    it('should save inactive client and send confirmation email', async (): Promise<void> => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByPhone.mockResolvedValue(null);

      await service.register(VALID_SAVE_DTO);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: VALID_SAVE_DTO.email,
          role: Role.CLIENT,
          active: false,
        }),
      );
      expect(emailService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when email belongs to active user', async (): Promise<void> => {
      repository.findByEmail.mockResolvedValue(validEntity1);

      const resultPromise: Promise<void> = service.register(VALID_SAVE_DTO);

      await expect(resultPromise).rejects.toThrow('already in use');
      await expect(resultPromise).rejects.toBeInstanceOf(RegistrationException);
      expect(emailService.sendConfirmationEmail).not.toHaveBeenCalled();
    });

    it('should throw exception when phone belongs to another user', async (): Promise<void> => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByPhone.mockResolvedValue(validEntity2);

      const resultPromise: Promise<void> = service.register(VALID_SAVE_DTO);

      await expect(resultPromise).rejects.toThrow('Phone');
      await expect(resultPromise).rejects.toBeInstanceOf(RegistrationException);
    });
  });
});
