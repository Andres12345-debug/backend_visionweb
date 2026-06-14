import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/modelos/usuario/usuario';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
