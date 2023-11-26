import {
  Body,
  Param,
  Controller,
  Get,
  Delete,
  Patch,
  Query,
  Post,
  NotFoundException,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from './decorators/serialize.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/interfaces/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
      createUserDto.role,
    );
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`No user found with the id ${id}`);
    }
    return user;
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    if (!users || !users.length) {
      throw new HttpException('No users found', HttpStatus.NO_CONTENT);
    }
    return users;
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
