import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    this.write('LOG', message, context);
  }
  error(message: string, trace?: string, context?: string) {
    this.write('ERROR', message, context, trace);
  }
  warn(message: string, context?: string) {
    this.write('WARN', message, context);
  }
  debug(message: string, context?: string) {
    this.write('DEBUG', message, context);
  }
  verbose(message: string, context?: string) {
    this.write('VERBOSE', message, context);
  }
  setLogLevels?(levels: LogLevel[]) {}

  private write(level: string, message: string, context?: string, trace?: string) {
    const ts = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    console.log(`${ts} ${level} ${ctx} ${message}`);
    if (trace) console.log(trace);
  }
}
