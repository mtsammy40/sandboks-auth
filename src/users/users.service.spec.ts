import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { userRepositoryTest } from "./users.controller.spec";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";
import { Logger } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "../microservice.test.config";

describe('UsersService', () => {
  let service: UsersService;
  let _kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, Logger, ClientKafka, {
        provide: getRepositoryToken(User),
        useValue: userRepositoryTest
      }],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "24h" }
        }),
        ClientsModule.register([
          { name: "KAFKA", options: microserviceTestConfig }
        ])
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    _kafkaClient = module.get<ClientKafka>(ClientKafka);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
