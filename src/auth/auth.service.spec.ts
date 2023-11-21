import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let TempUserService: Partial<UsersService>;

  const users: User[] = [];
  TempUserService = {
    findByEmail: (email: string) => {
      const user = users.filter((item) => item.email === email);
      return Promise.resolve(user[0]);
    },
    create: (email: string, name: string, password: string) => {
      const user = {
        id: Math.floor(Math.random() * 99999),
        name: name,
        email: email,
        password: password,
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '15s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: TempUserService,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign a new user', async () => {
    const user = await service.signup(
      'test1@email.com',
      'test-password',
      'test user',
    );
    expect(user.password).not.toEqual('test-password');
    expect(user.access_token).toBeDefined();
  });

  it('should throw an error if email is already in use', async () => {
    await service.signup('test2@email.com', 'test-password', 'test user');
    await expect(
      service.signup('test2@email.com', 'test-password', 'test user'),
    ).rejects.toThrowError(new BadRequestException('Email already in use'));
  });

  it('should throw an error when signing in with unused email', async () => {
    await expect(
      service.login('error-test@email.com','test-password' ),
    ).rejects.toThrowError(
      new UnauthorizedException('User not found, please sign up first.'),
    );
  });

  it('should throw an error when using wrong password', async () => {
    await service.signup('test3@email.com', 'test-password', 'test user');
    await expect(
      service.login('test3@email.com', 'not-test-password'),
    ).rejects.toThrowError(
      new UnauthorizedException('Invalid email or password.'),
    );
  });

  it('should login successfully', async () => {
    await service.signup('test4@email.com', 'testPassword', 'test user');
    const user = await service.login('test4@email.com','testPassword'
    );
    expect(user.access_token).toBeDefined();
  });
});
