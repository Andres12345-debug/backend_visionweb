import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/modelos/usuario/usuario';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Rol } from 'src/modelos/rol/rol';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Acceso, Rol])],
  providers: [RegistrosService],
  controllers: [RegistrosController]
})
export class RegistrosModule {}
