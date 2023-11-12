import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, userPassword: string, name: string) {
    // Check if email already in use
    const exist = await this.userService.find(email);
    if (exist) {
      throw new BadRequestException('Email already in use');
    }
    // hash user password
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(userPassword, salt);
    // create user and save it
    const user = await this.userService.create(email, name, hash);
    const { password, ...result } = user;
    const payload = {
      username: user.email,
      sub: {
        id: user.id,
      },
    };
    // returning result
    return { result, access_token: this.jwtService.sign(payload) };
  }


  async login(loginDto: LoginDto) {
    const user = await this.userService.find(loginDto.email);
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );
    if (!user || !passwordMatch) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload = {
      username: user.email,
      sub: {
        id: user.id,
      },
    };
    return {
      ...result,
      access_token: await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET}),
    };
  }

  async whoami(id: number) {
    const user = this.userService.findOne(id);
    return user;
  }
}
