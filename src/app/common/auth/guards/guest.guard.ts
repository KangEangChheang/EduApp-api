import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtHelper } from 'app/common/helpers/jwt';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return true; // Allow access if no Authorization header is present
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return true; // Allow access if no token is present
    }

    try {
      this.jwtHelper.verifyToken(token);
      throw new UnauthorizedException('You are already logged in');
    } catch (err) {
      return true; // Allow access if token is invalid (not logged in)
    }
  }
}
