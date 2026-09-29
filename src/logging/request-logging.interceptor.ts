import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(RequestLoggingInterceptor.name);

  private static readonly SENSITIVE_KEYS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'authorization',
  ];

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const className: string = context.getClass().name;
    const methodName: string = context.getHandler().name;
    const request: any = context.switchToHttp().getRequest();

    const params: string = JSON.stringify(request.params);
    const body: string = request.body
      ? JSON.stringify(this.sanitizeBody(request.body))
      : 'none';

    this.logger.debug(
      `${className}, ${methodName} called with params: ${params} and body: ${body}`,
    );

    const startedAt: number = Date.now();
    return next.handle().pipe(
      tap((): void => {
        this.logger.debug(
          `${className}.${methodName} returned result in ${Date.now() - startedAt} ms`,
        );
      }),

      catchError((error: any): never => {
        this.logger.warn(
          `${className}.${methodName} threw error: ${error.message} in ${Date.now() - startedAt} ms`,
        );

        throw error;
      }),
    );
  }

  private sanitizeBody(body: Record<string, any>): Record<string, any> {
    const sanitized = { ...body };
    for (const key of RequestLoggingInterceptor.SENSITIVE_KEYS) {
      if (key in sanitized) {
        sanitized[key] = '***';
      }
    }
    return sanitized;
  }
}
