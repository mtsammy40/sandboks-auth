import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenType, User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserModel } from './register_user.model';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export class PasswordManager {
  hash(password: string, salt?: string): {hashedPassword: string, salt: string} {
    // Creating a unique salt for a particular user 
    salt = salt ? salt : crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 

    const hash = crypto.pbkdf2Sync(password, salt,
      1000, 64, `sha512`).toString(`hex`);

    return {hashedPassword : hash, salt};
  }

  validate(password, salt, hashedPassword) {
    let hashedInputPassword =  this.hash(password, salt).hashedPassword;
    return hashedInputPassword === hashedPassword;
  }

}
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async createUser(userRegistrationData: RegisterUserModel): Promise<User> {
    const { first_name, last_name, email, password } = userRegistrationData;
    if (!first_name || !last_name || !email || !password) {
      throw new Error("Invalid input");
    }

    const duplicateUser = await this.findOneByEmail(userRegistrationData.email);
    if (duplicateUser) {
      throw new Error("Email already exists");
    }

    const user = new User();
    user.firstName = userRegistrationData.first_name;
    user.lastName = userRegistrationData.last_name;
    user.email = userRegistrationData.email;
    const hashedPasswordData = new PasswordManager().hash(userRegistrationData.password);
    user.passwordData = {
      password: hashedPasswordData.hashedPassword,
      salt: hashedPasswordData.salt,
      last_updated_at: new Date(),
      previous: []
    };
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.activeTokens = [];
    this.logger.log('Creat user id', JSON.stringify(user));

    await this.save(user);

    // Schedule activation email Notification
    await this.sendEmailVerificationLink(user);

    this.logger.log('Created user ', user);
    return user;
  }

  async sendEmailVerificationLink(user: User): Promise<void> {
    try {
      const emailVerificationToken = await this.generateEmailVerificationToken(user);
      user.activeTokens && typeof user.activeTokens === 'object' && user.activeTokens instanceof Array ?
        user.activeTokens.push({ type: TokenType.VERIFY_EMAIL, tokenString: emailVerificationToken })
        : user.activeTokens = [{ type: TokenType.VERIFY_EMAIL, tokenString: emailVerificationToken }];
      this.logger.log('Saving user ' + JSON.stringify(user))
      await this.save(user);
      console.log('User email verification template : ' + emailVerificationToken);
    } catch (e) {
      console.error(e);
      throw new Error("Failed to generate activation email token");
    }

    // todo send to notification service
  }

  async generateEmailVerificationToken(user: User): Promise<string> {
    this.logger.log('Generating verification token for user : ' + user.id);
    const payload = {
      user_id: user.id,
      type: TokenType.VERIFY_EMAIL
    };
    return this.jwtService.signAsync(payload, { expiresIn: "24h" });
  }

  async validateEmailVerificationLink(email: string, token: string): Promise<boolean> {
    let user: User;
    try {
      user = await this.findOneByEmail(email);
    } catch (e) {
      throw new Error("Invalid link");
    }
    if (!user) {
      throw new Error("Invalid link");
    }

    try {
      const tokenData = await this.jwtService.verifyAsync(token);
      console.log('TokenData ', tokenData);

      const tokenBelongsToUser: boolean = !!user.activeTokens.find(activeToken => {
        return activeToken.tokenString = token;
      });

      const isValid = tokenData.user_id === user.id && tokenBelongsToUser && tokenData.type === TokenType.VERIFY_EMAIL;

      if (isValid) {
        // remove active token - so that it is not usable again
        user.activeTokens = user.activeTokens.filter(activeToken => activeToken.tokenString !== token);
        this.save(user);
      }
      return isValid;
    } catch (e) {
      console.error(e);
      throw new Error('Invalid Link');
    }
  }
}
