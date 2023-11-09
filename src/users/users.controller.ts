import {
  Body,
  Param,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from 'src/decorators/serialize.decorator';

@Controller('api/v1/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.name, body.password);
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  find() {
    return this.userService.find();
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
