import { Mocked } from 'vitest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { User } from '../users/user.entity';

describe('EmailService', (): void => {
  const CODE_VALUE: string = 'test-code';

  let service: EmailService;
  let mailerService: Mocked<MailerService>;
  let serverUrl: string;
  let frontendUrl: string | undefined;
  let nodeEnv: string | undefined;

  const user: User = new User();
  user.email = 'user@test.com';

  beforeEach(async (): Promise<void> => {
    frontendUrl = undefined;
    nodeEnv = undefined;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: vi.fn(),
          },
        },
        {
          provide: ConfirmationCodesService,
          useValue: {
            generateConfirmationCode: vi.fn().mockResolvedValue(CODE_VALUE),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string): string | undefined => {
              if (key === 'FRONTEND_URL') {
                return frontendUrl;
              }
              if (key === 'NODE_ENV') {
                return nodeEnv;
              }
              return undefined;
            }),
            getOrThrow: vi.fn((key: string): string => {
              if (key === 'SERVER_URL') {
                return serverUrl;
              }
              throw new Error(`Unexpected config key ${key}`);
            }),
          },
        },
      ],
    }).compile();

    service = module.get(EmailService);
    mailerService = module.get(MailerService);
  });

  it('should send confirmation link built from SERVER_URL', async (): Promise<void> => {
    serverUrl = 'https://sport-club.ondigitalocean.app';

    await service.sendConfirmationEmail(user);

    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        text: expect.stringContaining(
          `https://sport-club.ondigitalocean.app/users/confirm/${CODE_VALUE}`,
        ),
      }),
    );
  });

  it('should not duplicate slash when SERVER_URL ends with slash', async (): Promise<void> => {
    serverUrl = 'http://localhost:3000/';

    await service.sendConfirmationEmail(user);

    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(
          `http://localhost:3000/users/confirm/${CODE_VALUE}`,
        ),
      }),
    );
  });

  it('should send link to the frontend page when FRONTEND_URL is set', async (): Promise<void> => {
    serverUrl = 'http://localhost:3000';
    frontendUrl = 'http://localhost:5173/';

    await service.sendConfirmationEmail(user);

    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(
          `http://localhost:5173/confirm-registration/${CODE_VALUE}`,
        ),
      }),
    );
  });

  describe('when the mail server is unavailable', (): void => {
    beforeEach((): void => {
      serverUrl = 'http://localhost:3000';
      mailerService.sendMail.mockRejectedValue(
        new Error('connect ECONNREFUSED 127.0.0.1:587'),
      );
    });

    afterEach((): void => {
      vi.restoreAllMocks();
    });

    it('should log the link instead of failing in development', async (): Promise<void> => {
      nodeEnv = 'development';
      const warn = vi
        .spyOn(Logger.prototype, 'warn')
        .mockImplementation((): void => {});

      await expect(
        service.sendConfirmationEmail(user),
      ).resolves.toBeUndefined();

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          `http://localhost:3000/users/confirm/${CODE_VALUE}`,
        ),
      );
    });

    it('should fail and not log the link outside development', async (): Promise<void> => {
      nodeEnv = 'production';
      const warn = vi
        .spyOn(Logger.prototype, 'warn')
        .mockImplementation((): void => {});

      await expect(service.sendConfirmationEmail(user)).rejects.toThrow(
        'ECONNREFUSED',
      );
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
