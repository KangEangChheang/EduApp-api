import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtHelper {
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');

    if (!this.secretKey) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
  }

  generateToken(payload: any): string {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn: '1h' }); // Added expiresIn
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate token');
    }
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
