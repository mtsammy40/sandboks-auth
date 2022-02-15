import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log('Validating user...', email, password);
    const user = await this.userService.findOneByEmail(email);
    if (user && user.passwordData.password === password) {
      this.logger.log('Returning user ... ');
      return user;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async login(user: User): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
