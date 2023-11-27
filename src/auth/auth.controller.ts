import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Serialize } from '../users/decorators/serialize.decorator';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('api/v1/auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
