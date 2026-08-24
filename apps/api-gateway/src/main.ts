import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe  } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api'); 

  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  
  await app.listen(process.env.API_GATEWAY_PORT ?? 3000);
}
bootstrap();
