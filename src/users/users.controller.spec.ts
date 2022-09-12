import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Status, TokenType, User } from "./user.entity";
import TestData from "../../test/TestData";
import { ApplicationException } from "../commons/application.exception";
import { ErrorCode } from "../commons/error.code";
import { getUserRepository } from "../../test/TestRepositories";
import { Logger } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "../microservice.test.config";

let userDb = TestData.users;
export const userRepositoryTest = getUserRepository(userDb);
export const userModuleTest = Test.createTestingModule({
  controllers: [UsersController],
  providers: [UsersService, Logger, ClientKafka, {
    provide: getRepositoryToken(User),
    useValue: userRepositoryTest
  }],
  imports: [
    // TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "24h" }
    }),
    ClientsModule.register([
      { name: "KAFKA", options: microserviceTestConfig }
    ])]
}).compile();


describe("UsersController", () => {
  let controller: UsersController;
  let userService: UsersService;
  let _kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await userModuleTest;

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    _kafkaClient = module.get<ClientKafka>(ClientKafka);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {

    it("should add a new user to the database", async function() {
      let user = {
        email: "unique@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      await controller.register(user);
      const createdUser = userRepositoryTest.findOne({ where: { email: user.email } });
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeTruthy();
    });

    it("should hash passwords before storing them in the db", async function() {
      let user = {
        email: "unique2@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      await controller.register(user);
      const createdUser = userRepositoryTest.findOne({ where: { email: user.email } });
      expect(createdUser.passwordData.salt).toBeTruthy();
      expect(createdUser.passwordData.password).not.toEqual(user.password);
    });

    it("should return id, status and email after creation", async function() {
      let user = {
        email: "unique3@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      const createdGoodUser = await controller.register(user);
      expect(createdGoodUser.id).toBeDefined();
      expect(createdGoodUser.email).toBeDefined();
      expect(createdGoodUser.status).toEqual(Status.NEW);
    });

    it("should return minified user without sensitive fields", async function() {
      let user = {
        email: "unique5@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      const createdGoodUser = await controller.register(user);
      expect(createdGoodUser["passwordData"]).not.toBeDefined();
      expect(createdGoodUser["activeTokens"]).not.toBeDefined();
      expect(createdGoodUser["passwordData"]).not.toBeDefined();
    });

    it("should generate email verification token", async function() {
      let user = {
        email: "unique4@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      await controller.register(user);
      const createdUser = userRepositoryTest.findOne({ where: { email: user.email } });
      expect(createdUser.activeTokens).toBeDefined();
      expect(createdUser.activeTokens.length).toBeGreaterThan(0);
      let verifyEmailToken = createdUser.activeTokens.find(_at => _at.type === TokenType.VERIFY_EMAIL);
      expect(verifyEmailToken).toBeDefined();

    });

    it("should throw an error if any key fields are missing", async function() {
      let badUserBody = {
        email: null,
        first_name: null,
        last_name: null,
        password: null
      };
      await expect(controller.register(badUserBody))
        .rejects
        .toEqual(ApplicationException.simpleException(ErrorCode.INVALID_INPUT, "Invalid inputs"));
    });

    it("should throw an error if the email is already in use", async function() {
      let user = {
        email: "test@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };
      await expect(controller.register(user))
        .rejects
        .toEqual(ApplicationException.simpleException(ErrorCode.INVALID_INPUT, "Email is already in use"));
    });

  });
});
