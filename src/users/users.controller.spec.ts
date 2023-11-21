import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    let users: User[] = [];
    fakeUserService = {
      create: (createUserDto: CreateUserDto) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email: createUserDto.email,
          name: createUserDto.name,
          password: bcrypt.hashSync(
            createUserDto.password,
            bcrypt.genSaltSync(12),
          ),
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      findOne: (id: number) => {
        const user = users.filter((item) => item.id === id);
        return Promise.resolve(user[0]);
      },
      findByEmail: (email: string) => {
        const user = users.filter((item) => item.email === email);
        return Promise.resolve(user[0]);
      },
      findAll: () => {
        return Promise.resolve(users);
      },
    };
    users = [];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user if id is correct', async () => {
    const newUser = await controller.create({
      email: 'test1@email.com',
      name: 'test user',
      password: 'test-password',
    });
    const user = await controller.findOne(newUser.id);
    expect(user).not.toEqual(null);
    expect(user.password).not.toEqual('test-password');
  });

  it('should throw not found error if id is not stored in database', async () => {
    await expect(controller.findOne(11)).rejects.toThrow(NotFoundException);
  });

  it('should get all users', async () => {
    const newUser1 = await controller.create({
      email: 'test3@email.com',
      password: 'test-password',
      name: 'test user',
    });
    const newUser2 = await controller.create({
      email: 'test4@email.com',
      password: 'test-password',
      name: 'test user',
    });
    const newUser3 = await controller.create({
      email: 'test5@email.com',
      password: 'test-password',
      name: 'test user',
    });
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(users[0].id).not.toEqual(users[1].id);
  });

  it('should threw no content exception if no users found', async () => {
    await expect(controller.findAll()).rejects.toThrowError(
      new HttpException('No users found', HttpStatus.NO_CONTENT
      ),
    );
  });
});
