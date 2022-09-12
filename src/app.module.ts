import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { APP_FILTER } from "@nestjs/core";
import { ApplicationExceptionFilter } from "./application-exception.filter";
import { ClientsModule } from "@nestjs/microservices";
import { microserviceConfig } from "./microservice.config";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(),
    AuthModule,
    ClientsModule.register([
      { name: "KAFKA", options: microserviceConfig }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, Logger, {
    provide: APP_FILTER,
    useClass: ApplicationExceptionFilter
  }]
})
export class AppModule {
}
