import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from './users/user.entity';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

}
