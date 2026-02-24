import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const puerto =
    Number(process.env.PORT) ||
    Number(process.env.PUERTO_SERVIDOR) ||
    3000;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 🔥 Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 👇 CLAVE para Docker / EasyPanel
  await app.listen(puerto, '0.0.0.0');

  console.log(`🚀 Servidor funcionando en puerto: ${puerto}`);
}

bootstrap();