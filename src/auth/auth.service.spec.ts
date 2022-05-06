import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { userRepositoryTest } from "../users/users.controller.spec";

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
