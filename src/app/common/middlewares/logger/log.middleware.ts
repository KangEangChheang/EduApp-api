import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from './log.service';  // Import the Logger service

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Log incoming request details
    this.logger.logRequest(req);

    const start = Date.now();  // Track start time for execution time

    // Wrap the response's send function to capture status code
    res.on('finish', () => {
      const executionTime = Date.now() - start;
      this.logger.logResponse(res, res.statusCode, executionTime);  // Log response status code and time
    });

    // Catching errors globally
    res.on('error', (error: any) => {
      this.logger.logError('Response error', error);  // Log the error if it happens
    });

    next();
  }
}
