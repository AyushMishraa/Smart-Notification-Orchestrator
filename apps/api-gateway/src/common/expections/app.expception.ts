import { HttpException, HttpStatus } from '@nestjs/common'

export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: { field?: string; message: string }[],
  ) {
    super(message, status)
  }
}