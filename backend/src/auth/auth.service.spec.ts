import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { V4 as PasetoV4 } from 'paseto';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let configService: ConfigService;

  const mockUser = {
    _id: '1',
    username: 'testuser',
    password: 'hashedPassword',
    role: 'user',
  };

  const mockUserService = {
    findOneByUsername: jest.fn().mockResolvedValue(mockUser),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test_secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const user = await service.validateUser('testuser', 'password');
    expect(user).toEqual({ _id: '1', username: 'testuser', role: 'user' });
    expect(userService.findOneByUsername).toHaveBeenCalledWith('testuser');
  });

  it('should return null for invalid credentials', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    const user = await service.validateUser('testuser', 'wrongpassword');
    expect(user).toBeNull();
  });

  it('should generate a PASETO token on login', async () => {
    const mockSign = jest.spyOn(PasetoV4, 'sign').mockResolvedValue('mock_token');
    const token = await service.login(mockUser);
    expect(token).toEqual({ access_token: 'mock_token' });
    expect(mockSign).toHaveBeenCalled();
  });
});
