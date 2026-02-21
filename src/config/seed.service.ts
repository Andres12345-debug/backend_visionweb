import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from '../modulos/privado/roles/roles.service';
import { Rol } from '../modelos/rol/rol';

@Injectable()
export class SeedService implements OnModuleInit {

  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    await this.crearRolBase();
  }

  private async crearRolBase() {
    const nombreRol = 'admin';

    const existe = await this.rolesService.verificarRol(nombreRol);

    if (!existe) {
      const nuevoRol = new Rol();
      nuevoRol.nombreRol = nombreRol;

      await this.rolesService.registrar(nuevoRol);

      console.log('✅ Rol admin creado automáticamente');
    } else {
      console.log('ℹ️ Rol admin ya existe');
    }
  }
}