import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { userRepositoryTest } from "../users/users.controller.spec";
import { UsersService } from "../users/users.service";
import { Logger } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "../microservice.test.config";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let _kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, {
        provide: getRepositoryToken(User),
        useValue: userRepositoryTest
      }, ClientKafka, Logger],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "24h" }
        }),
        ClientsModule.register([
          { name: "KAFKA", options: microserviceTestConfig }
        ])]
    }).compile();


    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    _kafkaClient = module.get<ClientKafka>(ClientKafka);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
