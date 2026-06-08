import { Body, Controller, Post, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CorreosService } from '../../publico/correos/correos.service';
import { ResponderCorreoDto } from '../../publico/correos/dto/responderCorreo.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('correos')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLES.ADMINISTRADOR)
export class CorreosController {

  constructor(private readonly correosService: CorreosService) { }

  // 🔥 GET TODOS
  @Get()
  async listarCorreos() {
    return this.correosService.obtenerCorreos();
  }

  // 🔥 GET POR ID
  @Get(':id')
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.correosService.obtenerCorreoPorId(id);
  }

  @Post('responder')
  async responderCorreo(@Body() datos: ResponderCorreoDto) {
    return this.correosService.responderCorreo(datos);
  }
}
