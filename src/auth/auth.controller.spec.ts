import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { userRepositoryTest } from "../users/users.controller.spec";
import { UsersService } from "../users/users.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, {
        provide: getRepositoryToken(User),
        useValue: userRepositoryTest
      }],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "24h" }
        })
      ]
    }).compile();


    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
