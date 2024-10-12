import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { V4 as PasetoV4 } from 'paseto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasetoAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const pasetoKey = this.configService.get<string>('PASETO_PUBLIC');
      if (!pasetoKey) {
        throw new UnauthorizedException('Invalid key provided');
      }

      // Verify the PASETO token
      const payload = await PasetoV4.verify(token, pasetoKey);

      // Attach the payload (user information) to the request object
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Helper method to extract the token from the Authorization header
  private extractTokenFromHeader(request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}

