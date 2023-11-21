import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserService: Partial<UsersService>;
  let users: User[] = [];

  fakeUserService = {
    create: (email: string, password: string, name: string) => {
      const user = {
        id: Math.floor(Math.random() * 9999),
        name,
        email,
        password,
      };
      users.push(user);
      return Promise.resolve(user);
    },
    findAll: () => {
      return Promise.resolve(users);
    },
    findByEmail: (email: string) => {
      const user = users.find((item) => item.email === email);
      return Promise.resolve(user);
    },
    findOne: (id: number) => {
      const user = users.find((item) => item.id === id);
      return Promise.resolve(user);
    },
    update: (id: number, attars: Partial<User>) => {
      const user = users.find((item) => item.id === id);
      Object.assign(user, attars);
      return Promise.resolve(user);
    },
    delete: (id: number) => {
      const user = users.findIndex((item) => item.id === id);
      const deleted = users.splice(user, 1);
      return Promise.resolve(deleted[0]);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    users = [];

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user test', () => {
    it('should create new user', async () => {
      const user = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      expect(user).toBeDefined();
    });
  });

  describe('get user by id', () => {
    it('should get user if id exist', async () => {
      const newUser = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      const user = await service.findOne(newUser.id);
      expect(user).toBeDefined();
    });
    it('should return nothing if id does not exist', async () => {
      const user = await service.findOne(11);
      expect(user).toBeUndefined();
    });
  });

  describe('get user by email', () => {
    it('should get user if email exist', async () => {
      const newUser = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      const user = await service.findByEmail(newUser.email);
      expect(user).toBeDefined();
    });
    it('should return nothing if email does not exist', async () => {
      const user = await service.findByEmail('invalid-email@email.com');
      expect(user).toBeUndefined();
    });
  });

  describe('get all users', () => {
    it('should get all users', async () => {
      const newUser1 = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      const newUser2 = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      const newUser3 = await service.create(
        'test@email.com',
        'test-password',
        'test user',
      );
      const users = await service.findAll();
      expect(users).toBeDefined();
    });

    it('should return nothing if no users found', async () => {
      const users = await service.findAll();
      expect(users.length).toEqual(0);
    })
  });
});
