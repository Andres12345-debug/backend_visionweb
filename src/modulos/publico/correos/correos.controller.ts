import { Body, Controller, Post, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { ContactoDto } from './dto/contacto.dto';
import { ResponderCorreoDto } from './dto/responderCorreo.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('correos')
export class CorreosController {

  constructor(private readonly correosService: CorreosService) { }

  // Formulario público de contacto del sitio: sin guard
  @Post('contacto')
  async enviarCorreo(@Body() contactoDto: ContactoDto) {
    return this.correosService.enviarFormulario(contactoDto);
  }

  // 🔥 GET TODOS
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  async listarCorreos() {
    return this.correosService.obtenerCorreos();
  }

  // 🔥 GET POR ID
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.correosService.obtenerCorreoPorId(id);
  }

  @Post('responder')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  async responderCorreo(@Body() datos: ResponderCorreoDto) {
    return this.correosService.responderCorreo(datos);
  }
}
