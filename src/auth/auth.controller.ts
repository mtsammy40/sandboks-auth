import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('locked')
  async locked(@Request() req): Promise<any> {
    return { ok: 'down' };
  }
}
