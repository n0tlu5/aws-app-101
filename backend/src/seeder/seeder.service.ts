import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly userService: UserService) {}

  async seed() {
    await this.seedUsers();
  }

  async seedUsers() {
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      },
      {
        username: 'testuser',
        password: 'password',
        role: 'user',
      },
    ];

    for (const userData of users) {
      const { username, password, role } = userData;

      const existingUser = await this.userService.findOneByUsername(username);
      if (!existingUser) {
        await this.userService.create(username, password);
        this.logger.log(`User ${username} has been created.`);
      } else {
        this.logger.log(`User ${username} already exists. Skipping...`);
      }
    }
  }
}
