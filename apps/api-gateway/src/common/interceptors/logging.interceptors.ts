import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor
  implements NestInterceptor
{
  private readonly logger =
    new Logger('API-Gateway');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context
            .switchToHttp()
            .getResponse();

          this.logger.log({
            event: 'http_request',
            method: request.method,
            path: request.originalUrl,
            statusCode: response.statusCode,
            durationMs: Date.now() - startedAt,
            requestId: request.requestId,
            correlationId: request.correlationId,
          });
        },

        error: (error) => {
          this.logger.error({
            event: 'http_request_error',
            method: request.method,
            path: request.originalUrl,
            durationMs: Date.now() - startedAt,
            requestId: request.requestId,
            correlationId: request.correlationId,
            error: error?.message,
          });
        },
      }),
    );
  }
}