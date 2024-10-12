import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: '1',
    username: 'testuser',
    password: 'hashedPassword',
    role: 'user',
  };

  // Mock Mongoose Model
  const mockUserModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    create: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by username', async () => {
    const user = await service.findOneByUsername('testuser');
    expect(user).toEqual(mockUser);
  });

  it('should hash the password and create a user', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    const newUser = await service.create('testuser', 'password');
    
    expect(newUser.password).toEqual('hashedPassword');
    expect(mockUserModel.create).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'hashedPassword',
    });
  });
});
