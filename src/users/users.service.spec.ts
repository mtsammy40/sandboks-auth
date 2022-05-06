import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { userRepositoryTest } from "./users.controller.spec";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
