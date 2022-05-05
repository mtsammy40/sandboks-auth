import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { randomUUID } from "crypto";
import TestData from "../../test/TestData";

describe("UsersController", () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "24h" }
        })
      ]
    }).compile();

    const serviceProvider = {
      provide: UsersService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
        findOne: jest.fn(() => []),
        findOneByEmail: jest.fn((email) => {
        }),
        createUser: jest.fn((userRegData) => {
          return TestData.users[0];
        }),
        save: jest.fn(() => {
        })
      })
    };

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should add a new user to the database", async function() {
      let user = {
        email: "test@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      await controller.register(user);

      expect(await userService.findOneByEmail(user.email)).toBeTruthy();
    });
  });
});
