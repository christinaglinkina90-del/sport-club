import { HttpException, HttpStatus } from '@nestjs/common';

export class AiProviderUnavailableException extends HttpException {
  constructor(provider: string) {
    super(
      `${provider} AI provider is temporarily unavailable`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
