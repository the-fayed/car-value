import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, userPassword: string, name: string) {
    // Check if email already in use
    const exist = await this.userService.findByEmail(email);
    if (exist) {
      throw new BadRequestException('Email already in use');
    }
    // hash user password
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(userPassword, salt);
    // create user and save it
    const user = await this.userService.create(email, userPassword, name);
    const payload = {
      username: user.email,
      sub: {
        id: user.id,
      },
    };
    // returning result
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found, please sign up first.');
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user?.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const payload = {
      username: user.email,
      sub: {
        id: user.id,
      },
    };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
