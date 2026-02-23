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

  // 🔥 Activar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // elimina campos no definidos en el DTO
      forbidNonWhitelisted: true,   // lanza error si envían campos extra
      transform: true,              // transforma tipos automáticamente
    }),
  );

  await app.listen(puerto, () => {
    console.log(`🚀 Servidor funcionando en puerto: ${puerto}`);
  });
}

bootstrap();