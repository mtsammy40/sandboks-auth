import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from "./application-exception.filter";
import { microserviceConfig } from "./microservice.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceConfig);
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
