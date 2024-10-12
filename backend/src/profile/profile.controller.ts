import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PasetoAuthGuard } from '../auth/paseto-auth.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(PasetoAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
