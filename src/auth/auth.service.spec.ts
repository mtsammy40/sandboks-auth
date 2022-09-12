import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { Logger } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "../microservice.test.config";
import TestData from "../../test/TestData";
import { getUserRepository } from "../../test/TestRepositories";

let userDb = TestData.users;
export const userRepositoryTest = getUserRepository(userDb);

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let _kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, ClientKafka, {
        provide: getRepositoryToken(User),
        useValue: userRepositoryTest
      }, Logger],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "24h" }
        }),
        ClientsModule.register([
          { name: "KAFKA", options: microserviceTestConfig }
        ])]
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    _kafkaClient = module.get<ClientKafka>(ClientKafka);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("shouldValidateSuccessfullyIfEmailExistsAndPasswordIsCorrect", async () => {
    let user = await service.validateUser("mtsammy40@gmail.com", "hashed");
    expect(user).toBeDefined();
    expect(user.id).toBeTruthy();
  });

  it("shouldThrowErrorIfEmailDoesNotExist", async () => {
    await expect(service.validateUser("wrong@email.com", "pass"))
      .rejects
      .toEqual(new Error('Invalid credentials'));
  });

  it('shouldThrowErrorIfEmailExistsButPasswordIsWrong', async () => {
    await expect(service.validateUser("mtsammy40@gmail.com", "pass"))
      .rejects
      .toEqual(new Error('Invalid credentials'));
  });

  it('shouldReturnAccessTokenWhenSuppliedValidDetails', async () => {
    let user = await service.validateUser("mtsammy40@gmail.com", "hashed");
    let accessTokenResult = await service.generateAccessToken(user);
    expect(accessTokenResult).toBeDefined();
    expect(accessTokenResult).toBeInstanceOf(Object);
    expect(typeof accessTokenResult['access_token']).toBe('string');

    const tokenData = await jwtService.verify(accessTokenResult['access_token']);
    expect(tokenData.sub).toEqual(user.id);
    expect(tokenData.email).toEqual(user.email);
  });
});
