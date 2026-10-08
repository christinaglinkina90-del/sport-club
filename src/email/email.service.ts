import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly confirmationCodesService: ConfirmationCodesService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(user: User): Promise<void> {
    const codeValue: string =
      await this.confirmationCodesService.generateConfirmationCode(user);

    const link: string = this.buildConfirmationLink(codeValue);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Confirm your registration',
        text: `To confirm your registration click the link - ${link}`,
      });
    } catch (error) {
      // Локально почтового сервера обычно нет. Чтобы регистрацию можно было
      // проверить, в режиме разработки не роняем запрос, а пишем ссылку в лог.
      // В остальных режимах ссылку в лог писать нельзя: по ней можно
      // подтвердить чужой аккаунт.
      if (!this.isDevelopment()) {
        throw error;
      }

      const reason: string =
        error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(
        `Confirmation email to ${user.email} was not sent (${reason}). ` +
          `Development mode, confirmation link: ${link}`,
      );
    }
  }

  private isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  // FRONTEND_URL - адрес фронтенда, например http://localhost:5173.
  // Если он задан, ссылка ведёт на страницу подтверждения во фронтенде.
  // Иначе - напрямую на бэкенд по SERVER_URL, например
  // http://localhost:3000 или https://sport-club.ondigitalocean.app
  private buildConfirmationLink(codeValue: string): string {
    const frontendUrl: string | undefined =
      this.configService.get<string>('FRONTEND_URL');

    if (frontendUrl) {
      return `${this.trimSlashes(frontendUrl)}/confirm-registration/${codeValue}`;
    }

    const serverUrl: string =
      this.configService.getOrThrow<string>('SERVER_URL');

    return `${this.trimSlashes(serverUrl)}/users/confirm/${codeValue}`;
  }

  private trimSlashes(url: string): string {
    return url.replace(/\/+$/, '');
  }
}
