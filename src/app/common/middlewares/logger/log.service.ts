import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LogService implements LoggerService {
  log(message: string) {
    console.log(`[INFO]: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`[ERROR]: ${message}\nTrace: ${trace}`);
  }

  warn(message: string) {
    console.warn(`[WARN]: ${message}`);
  }

  debug(message: string) {
    console.debug(`[DEBUG]: ${message}`);
  }

  verbose(message: string) {
    console.log(`[VERBOSE]: ${message}`);
  }

  logRequest(req: any) {
    const { method, url } = req;
    console.log(`[REQUEST]: ${method} | ${url}`);
  }

  logResponse(res: any, statusCode: number, responseTime: number) {
    console.log(`[RESPONSE]: ${statusCode} | ${responseTime}ms`);
  }

  logError(message: string, error: any) {
    console.error(`[ERROR]: ${message}\n${error.stack || error.message}`);
  }
}
