import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import { AppException } from '../expections/app.expception'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const requestId =
      (request.headers['x-request-id'] as string) || randomUUID()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code = 'INTERNAL_SERVER_ERROR'
    let message = 'An unexpected error occurred'
    let details: { field?: string; message: string }[] | undefined

    if (exception instanceof AppException) {
      status = exception.getStatus()
      code = exception.code
      message = exception.message
      details = exception.details
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      // Handles NestJS's built-in ValidationPipe errors (class-validator)
      if (typeof res === 'object' && res !== null) {
        const resObj = res as any
        message = resObj.message || exception.message
        code = this.mapStatusToCode(status)

        // class-validator errors come as an array of strings
        if (Array.isArray(resObj.message)) {
          message = 'Request validation failed'
          details = resObj.message.map((m: string) => ({ message: m }))
        }
      } else {
        message = res as string
        code = this.mapStatusToCode(status)
      }
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(exception.message, exception.stack)
    }

    // Always log unexpected (500) errors server-side with full detail
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled exception [${requestId}]`,
        exception instanceof Error ? exception.stack : exception,
      )
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        ...(details && details.length > 0 ? { details } : {}),
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    })
  }

  private mapStatusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    }
    return map[status] || 'ERROR'
  }
}