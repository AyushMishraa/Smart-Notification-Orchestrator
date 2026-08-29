import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { CorrelationIdMiddleware } from './common/middlewares/correlation-id.middleware';
import { ConfigModule } from '@nestjs/config';
import gatewayConfig from './config/gateway.config';
import { ProxyModule } from './modules/proxy/proxy.module';
import { HealthModule } from './modules/health/health/health.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig],
    }),
    ProxyModule,
    HealthModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
