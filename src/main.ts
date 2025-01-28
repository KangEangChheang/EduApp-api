import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WsAdapter } from '@nestjs/platform-ws'; // WebSocket Adapter
// import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import "colors"
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the 'public' folder
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable WebSocket support and inject config service into websocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // Set a global prefix for all controllers (e.g., '/api')
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: undefined }], // Exclude root path
  }); // This apply '/api' to all routes

  // Enable CORS
  app.enableCors();


  //swagger
  const config = new DocumentBuilder()
    .setTitle('EduFunApp Api Documentation')
    .setDescription('Im lazy okay?')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'HTTP Server') // Add HTTP server
    .addServer(`ws://localhost:${process.env.PORT || 3000}`, 'WebSocket Server') // Add WebSocket server
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    autoTagControllers: true,
  });
  SwaggerModule.setup('api', app, documentFactory);

  // Start the application
  await app.listen(process.env.PORT || 3000);

  console.log(`\nApplication is running on: ${`http://localhost:${process.env.PORT || 3000}`.blue}`.yellow);
}
bootstrap();
