import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from '../modulos/privado/roles/roles.service';
import { ConocimientoService } from '../modulos/privado/conocimiento/conocimiento.service';
import { Rol } from '../modelos/rol/rol';
import { ROLES } from '../middleware/seguridad/seguridad/helpers/rol.helper';

@Injectable()
export class SeedService implements OnModuleInit {

  constructor(
    private readonly rolesService: RolesService,
    private readonly conocimientoService: ConocimientoService,
  ) {}

  async onModuleInit() {
    await this.crearRolesBase();
    await this.crearConocimientoBase();
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

  private async crearConocimientoBase() {

    if (await this.conocimientoService.existeAlguno()) {
      console.log('ℹ️ Base de conocimiento de la IA ya tiene datos');
      return;
    }

    const conocimientoBase = [
      {
        titulo: 'Quiénes somos',
        contenido: 'VisionWeb es una empresa colombiana especializada en soluciones tecnológicas empresariales Open Source.',
        categoria: 'empresa',
      },
      {
        titulo: 'Mesa de Ayuda Profesional',
        contenido: 'Implementación y soporte de la mesa de ayuda para gestión de tickets, incidentes y solicitudes de TI.',
        categoria: 'servicios',
      },
      {
        titulo: 'Gestión de Inventario TI',
        contenido: 'Control centralizado de activos tecnológicos (computadores, servidores, periféricos, software).',
        categoria: 'servicios',
      },
      {
        titulo: 'Documentación técnica',
        contenido: 'Base de conocimiento integrada en la mesa de ayuda.',
        categoria: 'servicios',
      },
      {
        titulo: 'Reportes y métricas',
        contenido: 'Dashboards e informes de rendimiento del área TI.',
        categoria: 'servicios',
      },
      {
        titulo: 'Soporte multiplataforma',
        contenido: 'Compatibilidad con Windows, Linux y Mac.',
        categoria: 'servicios',
      },
      {
        titulo: 'Control y seguridad',
        contenido: 'Gestión de accesos y auditoría de activos.',
        categoria: 'servicios',
      },
      {
        titulo: 'Contacto comercial',
        contenido: 'Para solicitar una demo o cotización, pueden escribir al WhatsApp +57 300 753 8453 o usar el formulario de contacto del sitio web.',
        categoria: 'contacto',
      },
    ];

    for (const item of conocimientoBase) {
      await this.conocimientoService.registrar(item);
    }

    console.log('✅ Base de conocimiento de la IA sembrada con datos iniciales');
  }
}
