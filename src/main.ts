import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApplicationExceptionFilter } from "./application-exception.filter";
import { microserviceConfig } from "./microservice.config";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as path from "path";

const myFormat = winston.format.printf( ({ level, message, timestamp , ...metadata}) => {
  let context;
  if(metadata) {
    context = metadata.context || 'Application';
  }
  let msg = `${timestamp} [${level}] \t[${context}] : ${message} `
  if(metadata) {
    msg += JSON.stringify(metadata)
  }
  return msg
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.splat(),
        myFormat
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/debug/'), //path to where save loging result
          filename: 'debug.log', //name of file where will be saved logging result
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/info/'),
          filename: 'info.log',
          level: 'info',
        }),
      ],
    })
  });
  app.connectMicroservice(microserviceConfig);
  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
