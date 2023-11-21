import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let users: User[] = [];

  beforeEach(async () => {
    fakeAuthService = {
      login: (email: string, password: string) => {
        const user = users.find((user) => user.email === email);
        if (!user) {
          throw new UnauthorizedException(
            'User not found, please sign up first.',
          );
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!user || !passwordMatch) {
          throw new BadRequestException('Invalid email or password.');
        }
        return Promise.resolve({
          ...user,
          access_token: 'very random access token',
        });
      },
      signup: (email: string, password: string, name: string) => {
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
          throw new BadRequestException('Email already in use.');
        }
        const user = {
          id: Math.floor(Math.random() * 99999),
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(12)),
        } as User;
        users.push(user);
        return Promise.resolve({
          ...user,
          access_token: 'very random access token',
        });
      },
    };
    users = [];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up new user', async () => {
    const user = await controller.signup({
      email: 'test@email.com',
      password: 'test-password',
      name: 'test user',
    });
    expect(user).toBeDefined();
    expect(user.access_token).toBeDefined();
  });

  it('should throw error if email already in use', async () => {
    const user = await controller.signup({
      email: 'test@email.com',
      password: 'test-password',
      name: 'test user',
    });
    await expect(
      controller.signup({
        email: 'test@email.com',
        password: 'test-password',
        name: 'test user',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should log in if email and password match', async () => {
    const newUser = await controller.signup({
      email: 'test@email.com',
      password: 'test-password',
      name: 'test user',
    });
    const user = await controller.login({
      email: 'test@email.com',
      password: 'test-password',
    });
    expect(user).toBeDefined();
    expect(user.access_token).toBeDefined();
  });
});
