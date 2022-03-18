import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users/users.service";
import { AuthModule } from "./auth/auth.module";
import { APP_FILTER } from "@nestjs/core";
import { ApplicationExceptionFilter } from "./application-exception.filter";

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: ApplicationExceptionFilter
  }]
})
export class AppModule {
}
