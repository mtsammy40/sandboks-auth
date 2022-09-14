import { Logger, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "../microservice.test.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    ClientsModule.register([
      { name: "KAFKA", options: microserviceTestConfig }
    ])
  ],
  providers: [UsersService, Logger],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
