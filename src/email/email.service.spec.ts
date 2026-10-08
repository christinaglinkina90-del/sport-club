import { Mocked } from 'vitest';
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

  const user: User = new User();
  user.email = 'user@test.com';

  beforeEach(async (): Promise<void> => {
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
});
