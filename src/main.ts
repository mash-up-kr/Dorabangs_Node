// Nest Pacakges
import { NestFactory } from '@nestjs/core';

// Custom Packages
import { AppModule } from './app.module';
import { nestAppConfig, nestResponseConfig } from './app.config';
import { nestSwaggerConfig } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Config Nest.js Application
  nestAppConfig(app);
  // Config application Swagger
  nestSwaggerConfig(app);
  // Config Response Type
  nestResponseConfig(app, false);

  await app.listen(3000);
}
bootstrap();
