import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from "./application-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
