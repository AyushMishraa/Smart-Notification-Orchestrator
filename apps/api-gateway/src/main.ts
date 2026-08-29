import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe  } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { corsConfig } from './config/cors.config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: corsConfig().cors.allowedOrigins,
    credentials: true,
  });
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  const config = new DocumentBuilder()
  .setTitle('Smart Notification Orchestrator API')
  .setDescription(
    'Public API for the Smart Notification Orchestrator',
  )
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );

  await app.listen(process.env.API_GATEWAY_PORT ?? 3000);
}

bootstrap();
