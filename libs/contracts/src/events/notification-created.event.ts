import { NotificationChannel } from '../enums/notification-channel.enum';

export class NotificationCreatedEvent {
  constructor(
    public readonly notificationId: string,
    public readonly channel: NotificationChannel,
    public readonly createdAt: Date = new Date(),
  ) {}
}
