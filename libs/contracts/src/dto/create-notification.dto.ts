import { NotificationChannel } from '../enums/notification-channel.enum';

export class CreateNotificationDto {
  recipientId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}
