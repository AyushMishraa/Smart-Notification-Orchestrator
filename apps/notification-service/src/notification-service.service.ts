import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationServiceService {
  getHealth() {
    return { status: 'ok', service: 'notification-service', timestamp: new Date().toISOString() };
  }
}
