import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RegisterUserDto } from "./register_user.model";
import { UsersService } from "./users.service";
import { SlimUser } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Post("register")
  public async register(
    @Body() userRegistrationData: RegisterUserDto
  ): Promise<SlimUser> {
    return this.userService.createUser(userRegistrationData)
      .then(user => {
        return user.slim();
      });
  }

  @Get("verify_email")
  public async verifyEmail(
    @Query("token") token,
    @Query("email") email
  ): Promise<string> {
    if (await this.userService.validateEmailVerificationLink(email, token)) {
      return "Email verified successfully";
    } else {
      return "Email verification failed";
    }
  }
}
