import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { RouterModule, Routes } from '@nestjs/core';
import { CorreosModule } from './correos/correos.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ClienteServiciosModule } from './cliente_servicios/cliente_servicios.module';
import { ConocimientoModule } from './conocimiento/conocimiento.module';


const routes: Routes = [
  {
    path: 'privado',
    children: [UsuariosModule, RolesModule, CorreosModule, ServiciosModule, ClienteServiciosModule, ConocimientoModule]
  }
];
@Module({
  imports: [
    UsuariosModule,
    RolesModule,
    RouterModule.register(routes),
    CorreosModule,
    ServiciosModule,
    ClienteServiciosModule,
    ConocimientoModule],
  exports: [RouterModule]
})
export class PrivadoModule { }
