import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

interface RequestWithIds extends Request {
  correlationId: string;
  requestId: string;
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(
    req: RequestWithIds,
    res: Response,
    next: NextFunction,
  ) {
    const correlationId =
      req.header('x-correlation-id') ?? randomUUID();

    const requestId = randomUUID();

    req.correlationId = correlationId;
    req.requestId = requestId;

    res.setHeader(
      'x-correlation-id',
      correlationId,
    );

    res.setHeader(
      'x-request-id',
      requestId,
    );

    next();
  }
}