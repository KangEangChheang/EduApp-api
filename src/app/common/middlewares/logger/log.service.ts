import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class LogService implements LoggerService {
  log(message: string) {
    Logger.log(`[INFO]: ${message}`);
  }

  error(message: string, trace: string) {
    Logger.error(`[ERROR]: ${message}\nTrace: ${trace}`);
  }

  warn(message: string) {
    Logger.warn(`[WARN]: ${message}`);
  }

  debug(message: string) {
    Logger.debug(`[DEBUG]: ${message}`);
  }

  verbose(message: string) {
    Logger.log(`[VERBOSE]: ${message}`);
  }

  logRequest(req: any) {
    const { method, url } = req;
    Logger.log(`[REQUEST]: ${method} | ${url}`);
  }

  logResponse(res: any, statusCode: number, responseTime: number) {
    Logger.log(`[RESPONSE]: ${statusCode} | ${responseTime}ms`);
  }

  logError(message: string, error: any) {
    Logger.error(`[ERROR]: ${message}\n${error.stack || error.message}`);
  }
}
