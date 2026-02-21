import { Module } from '@nestjs/common';
import { AccesosModule } from './accesos/accesos.module';
import { RegistrosModule } from './registros/registros.module';
import { RouterModule, Routes } from '@nestjs/core';
import { AccesosController } from './accesos/accesos.controller';
import { RegistrosController } from './registros/registros.controller';
import { AccesosService } from './accesos/accesos.service';
import { RegistrosService } from './registros/registros.service';

const routes: Routes = [
    {
      path: 'publico',
      children: [AccesosModule, RegistrosModule
        
      ]
    }
  ]

@Module({
  imports: [
    RouterModule.register(routes),
    AccesosModule, RegistrosModule],
    exports: [RouterModule],
    providers: [AccesosService, RegistrosService],
    controllers: [AccesosController, RegistrosController]
})
export class PublicoModule {}
