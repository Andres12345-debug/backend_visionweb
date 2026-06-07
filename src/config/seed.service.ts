import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from '../modulos/privado/roles/roles.service';
import { Rol } from '../modelos/rol/rol';
import { ROLES } from '../middleware/seguridad/seguridad/helpers/rol.helper';

@Injectable()
export class SeedService implements OnModuleInit {

  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    await this.crearRolesBase();
  }

  private async crearRolesBase() {
    const nombresRoles = [ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.CLIENTE];

    for (const nombreRol of nombresRoles) {
      const existe = await this.rolesService.verificarRol(nombreRol);

      if (!existe) {
        const nuevoRol = new Rol();
        nuevoRol.nombreRol = nombreRol;

        await this.rolesService.registrar(nuevoRol);

        console.log(`✅ Rol ${nombreRol} creado automáticamente`);
      } else {
        console.log(`ℹ️ Rol ${nombreRol} ya existe`);
      }
    }
  }
}
