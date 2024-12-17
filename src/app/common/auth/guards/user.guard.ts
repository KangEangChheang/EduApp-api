import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtHelper } from 'src/app/common/helpers/jwt';


@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.jwtHelper.verifyToken(token);
      request.user = decoded; // Attach user data to the request object for later use
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
