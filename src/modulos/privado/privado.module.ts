import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { RouterModule, Routes } from '@nestjs/core';


const routes: Routes = [
  {
    path: 'privado',
    children: [UsuariosModule, RolesModule]
  }
];
@Module({
  imports: [
    UsuariosModule,
    RolesModule,
    RouterModule.register(routes),],
  exports: [RouterModule]
})
export class PrivadoModule { }
