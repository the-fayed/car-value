import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    // fakeAuthService = {
    //   login: () => {},
    //   signup: () => {},
    // }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],

    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
