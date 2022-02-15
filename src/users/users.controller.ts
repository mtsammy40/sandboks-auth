import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LeanUser } from './lean_user.model';
import { RegisterUserModel } from './register_user.model';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}


    @Post('register')
    public async register(@Body() userRegistrationData: RegisterUserModel): Promise<LeanUser> {
        return LeanUser.fromUser(await this.userService.createUser(userRegistrationData));
    }

    @Get('verify_email') 
    public async verifyEmail(@Query('token') token, @Query('email') email): Promise<string> {
        if(await this.userService.validateEmailVerificationLink(email, token)) {
            return 'Email verified successfully';
        } else {
            return 'Email verification failed';
        }
    }
}
