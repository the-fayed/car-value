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

@Controller('api/v1/users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) {}

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
