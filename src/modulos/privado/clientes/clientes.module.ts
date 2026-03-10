import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clientes } from 'src/modelos/clientes/clientes';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clientes]) ],
  providers: [ClientesService],
  controllers: [ClientesController]
})
export class ClientesModule {}
