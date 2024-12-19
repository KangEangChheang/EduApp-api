import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WsAdapter } from '@nestjs/platform-ws'; // WebSocket Adapter
import { ConfigService } from '@nestjs/config';
import "colors"
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the 'public' folder
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable WebSocket support and inject config service into websocket
  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
  app.useWebSocketAdapter(new WsAdapter(app.get(ConfigService)));

  // Set a global prefix for all controllers (e.g., '/api')
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: undefined }], // Exclude root path
  }); // This apply '/api' to all routes

  // Enable CORS
  app.enableCors();

  // Start the application
  await app.listen(process.env.PORT || 3000);

  console.log(`\nApplication is running on: ${`http://localhost:${process.env.PORT || 3000}`.blue}`.yellow);
}
bootstrap();
