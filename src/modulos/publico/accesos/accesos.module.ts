import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import { AccesosService } from './accesos.service';
import { AccesosController } from './accesos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Acceso, Usuario])],
  providers: [AccesosService],
  controllers: [AccesosController]
})
export class AccesosModule {}
