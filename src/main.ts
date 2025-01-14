import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { EntityAlreadyExistsExceptionFilter } from './common/exceptions';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new EntityAlreadyExistsExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get('port') || 3003;

  app.use(helmet());

  await app.listen(port);

  console.log(`Server running on the PORT ${port}`);
}
bootstrap();
