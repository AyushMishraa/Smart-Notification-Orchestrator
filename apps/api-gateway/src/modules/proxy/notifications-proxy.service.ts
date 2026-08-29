import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationProxyService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async createNotification(payload: unknown) {
    const baseUrl =
      this.config.getOrThrow<string>(
        'apiGateway.notificationServiceUrl',
      );

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${baseUrl}/api/v1/notifications`,
          payload,
        ),
      );

      return response.data;
    } catch {
      throw new ServiceUnavailableException(
        'Notification service is temporarily unavailable',
      );
    }
  }
}