import { Injectable, Logger  } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { V4 as PasetoV4 } from 'paseto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly secretKey: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('PASETO_SECRET');
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id, role: user.role };
    const token = await PasetoV4.sign(payload, this.secretKey, { expiresIn: '1h' });
    return { access_token: token };
  }
}
