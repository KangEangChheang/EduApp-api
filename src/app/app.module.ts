import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger/log.middleware';
import { LogService } from './common/middlewares/logger/log.service';
import { DatabaseModule } from 'database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './http/http.module';
import { WsModule } from './ws/ws.module';
import { AppController } from './app.controller';

@Module({
  controllers: [
    AppController,
  ],
  imports: [
    // all http module ======================================
    HttpModule,
    // all ws module ======================================
    WsModule,
    // Other module ======================================
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    LogService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(LoggerMiddleware).forRoutes('*'); // add logger middleware to to log error, info
  }
}
