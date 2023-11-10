import {
  Body,
  Param,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Query,
  Session,
  HttpCode,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/users/decorators/serialize.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/v1/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.name,
    );
    session.userId = user.id;
    return user;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoami(@Session() session: any) {
    const loggedUser = await this.userService.findOne(session.userId);
    if (!loggedUser) {
      throw new UnauthorizedException('You no longer logged in!');
    }
    return loggedUser;
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Session() session: any) {
    session.userId = undefined;
  }

  @Get()
  find(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
