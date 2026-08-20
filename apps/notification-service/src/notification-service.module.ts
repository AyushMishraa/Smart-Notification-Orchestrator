import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { AppConfigModule } from '@app/config';
import { LoggingModule } from '@app/logging';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [AppConfigModule, LoggingModule, DatabaseModule],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
