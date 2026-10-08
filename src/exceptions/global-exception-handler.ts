import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/internal';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionHandler.name);

  catch(exception: any, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const request: any = context.getRequest();
    const response: any = context.getResponse();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = this.getHttpExceptionMessage(exception);
      this.logger.warn(message);
    } else {
      this.logger.error(exception.stack);
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      status,
      message,
    });
  }

  // ValidationPipe кладёт список ошибок полей в тело ответа исключения,
  // а exception.message содержит только общее "Bad Request Exception".
  private getHttpExceptionMessage(exception: HttpException): string | string[] {
    const exceptionResponse: string | object = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      (typeof exceptionResponse.message === 'string' ||
        Array.isArray(exceptionResponse.message))
    ) {
      return exceptionResponse.message as string | string[];
    }

    return exception.message;
  }
}
