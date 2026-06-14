import { Module } from '@nestjs/common';
import { AccesosModule } from './accesos/accesos.module';
import { RegistrosModule } from './registros/registros.module';
import { RouterModule, Routes } from '@nestjs/core';
import { CorreosModule } from './correos/correos.module';

const routes: Routes = [
    {
      path: 'publico',
      children: [AccesosModule, RegistrosModule, CorreosModule]
    }
  ]

@Module({
  imports: [
    RouterModule.register(routes),
    AccesosModule,
    RegistrosModule,
    CorreosModule
  ],
  exports: [RouterModule]
})
export class PublicoModule {}