import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Status, TokenType, User } from "./user.entity";
import TestData from "../../test/TestData";
import { v4 as uuid } from "uuid";
import { ApplicationException } from "../commons/application.exception";
import { ErrorCode } from "../commons/error.code";


describe("UsersController", () => {
  let controller: UsersController;
  let userService: UsersService;
  let userDb = TestData.users;
  let userRepository = {
    find: jest.fn(() => TestData.users),
    findOne: jest.fn((criteria) => {
      let id, email;
      console.log("Mocking find one :: ", criteria);
      if (criteria && typeof criteria === "string") {
        id = criteria;
        return userDb.find((_user) => _user.id === id);
      } else if (criteria && typeof criteria === "object" && criteria.where.email) {
        email = criteria.where.email;
        return userDb.find((_user) => _user.email === email);
      }
    }),
    delete: jest.fn((id) => {
      console.log("Mocking delete one :: ", id);
      userDb = userDb.filter((_user) => _user.id !== id);
    }),
    save: jest.fn((_user) => {
      console.log("Mocking save :: ", _user);
      _user.id = _user.id ? _user.id : uuid();
      userDb.push(_user);
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, {
        provide: getRepositoryToken(User),
        useValue: userRepository
      }],
      imports: [
        // TypeOrmModule.forFeature([User]),
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
  })
  ;

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {

    it("should add a new user to the database", function() {
      let user = {
        email: "unique@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      controller.register(user).then((createdGoodUser) => {
        expect(userService.findOneByEmail(user.email)).resolves.toBeTruthy();
        const createdUser = userRepository.findOne({ where: { email: user.email } });
        expect(createdUser).toBeDefined();
        expect(createdUser.id).toBeTruthy();
      });
    });

    it("should hash passwords before storing them in the db", async function() {
      let user = {
        email: "unique2@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      controller.register(user).then((createdGoodUser) => {
        const createdUser = userRepository.findOne({ where: { email: user.email } });
        expect(createdUser.passwordData.salt).toBeTruthy();
        expect(createdUser.passwordData.password).not.toEqual(user.password);
      });
    });

    it("should return id, status and email after creation", async function() {
      let user = {
        email: "unique3@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      controller.register(user).then((createdGoodUser) => {
        expect(createdGoodUser.id).toBeDefined();
        expect(createdGoodUser.email).toBeDefined();
        expect(createdGoodUser.status).toEqual(Status.NEW);
      });
    });

    it("should return minified user without sensitive fields", async function() {
      let user = {
        email: "unique@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      controller.register(user).then((createdGoodUser) => {
        expect(createdGoodUser["passwordData"]).not.toBeDefined();
        expect(createdGoodUser["activeTokens"]).not.toBeDefined();
        expect(createdGoodUser["passwordData"]).not.toBeDefined();
      });

    });

    it("should generate email verification token", async function() {
      let user = {
        email: "unique4@gmail.com",
        first_name: "Samuel",
        last_name: "Mutemi",
        password: "password"
      };

      controller.register(user).then((createdGoodUser) => {
        const createdUser = userRepository.findOne({ where: { email: user.email } });
        expect(createdUser.activeTokens).toBeDefined();
        expect(createdUser.activeTokens.length).toBeGreaterThan(0);
        let verifyEmailToken = createdUser.activeTokens.find(_at => _at.type === TokenType.VERIFY_EMAIL);
        expect(verifyEmailToken).toBeDefined();
      });

    });

    it("should throw an error if any key fields are missing", async function() {
      let badUserBody = {
        email: null,
        first_name: null,
        last_name: null,
        password: null
      };
      expect(controller.register(badUserBody))
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
      expect(controller.register(user))
        .rejects
        .toEqual(ApplicationException.simpleException(ErrorCode.INVALID_INPUT, "Email is already in use"));
    });

  });
});
