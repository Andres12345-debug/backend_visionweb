import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrivadoModule } from './modulos/privado/privado.module';
import { PublicoModule } from './modulos/publico/publico.module';
import { ConexionModule } from './config/conexion/conexion.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modulos/privado/roles/roles.module';
import { ConocimientoModule } from './modulos/privado/conocimiento/conocimiento.module';
import { SeedService } from './config/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ConexionModule,
    PublicoModule,
    PrivadoModule,
    RolesModule, // 👈 importante
    ConocimientoModule
  ],
  controllers: [AppController],
  providers: [AppService, SeedService], // 👈 agregar aquí
})
export class AppModule {}
