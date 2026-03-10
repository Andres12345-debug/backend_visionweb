import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { RouterModule, Routes } from '@nestjs/core';
import { ClientesModule } from './clientes/clientes.module';


const routes: Routes = [
  {
    path: 'privado',
    children: [UsuariosModule, RolesModule, ClientesModule]
  }
];
@Module({
  imports: [
    UsuariosModule,
    RolesModule,
    RouterModule.register(routes),
    ClientesModule],
  exports: [RouterModule]
})
export class PrivadoModule { }
