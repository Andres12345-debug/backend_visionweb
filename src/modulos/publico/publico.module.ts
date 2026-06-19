import { Module } from '@nestjs/common';
import { AccesosModule } from './accesos/accesos.module';
import { RegistrosModule } from './registros/registros.module';
import { RouterModule, Routes } from '@nestjs/core';
import { CorreosModule } from './correos/correos.module';
import { AsistenteModule } from './asistente/asistente.module';
import { TelegramModule } from './telegram/telegram.module';

const routes: Routes = [
    {
      path: 'publico',
      children: [AccesosModule, RegistrosModule, CorreosModule, AsistenteModule]
    }
  ]

@Module({
  imports: [
    RouterModule.register(routes),
    AccesosModule,
    RegistrosModule,
    CorreosModule,
    AsistenteModule,
    TelegramModule
  ],
  exports: [RouterModule]
})
export class PublicoModule {}