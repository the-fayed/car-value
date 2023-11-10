import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(email: string, password: string, name: string) {
    // Check if email already in use
    const exist = await this.userService.find(email);
    if (exist) {
      throw new BadRequestException('Email already in use');
    }
    // hash user password
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    // create user and save it
    const user = await this.userService.create(email, name, hash);
    // return signed user
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('No user found with this email');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email or password is not correct!');
    }
    return user;
  }
}
