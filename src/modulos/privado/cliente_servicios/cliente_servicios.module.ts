import { Module } from '@nestjs/common';
import { ClienteServiciosService } from './cliente_servicios.service';
import { ClienteServiciosController } from './cliente_servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteServicios } from 'src/modelos/cliente_servicios/cliente_servicios';
import { Usuario } from 'src/modelos/usuario/usuario';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClienteServicios, Usuario])],
  providers: [ClienteServiciosService],
  controllers: [ClienteServiciosController]
})
export class ClienteServiciosModule {}
