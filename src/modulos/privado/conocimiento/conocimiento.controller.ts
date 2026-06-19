import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ConocimientoService } from './conocimiento.service';
import { CrearConocimientoDto } from './dto/crear-conocimiento.dto';
import { ActualizarConocimientoDto } from './dto/actualizar-conocimiento.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('conocimiento')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLES.ADMINISTRADOR)
export class ConocimientoController {

  constructor(private readonly conocimientoService: ConocimientoService) {}

  @Get()
  public obtenerTodos() {
    return this.conocimientoService.consultar();
  }

  @Post('/agregar')
  public registrar(@Body() datos: CrearConocimientoDto) {
    return this.conocimientoService.registrar(datos);
  }

  @Put('/actualizar/:id')
  public actualizar(@Param('id') id: number, @Body() datos: ActualizarConocimientoDto) {
    return this.conocimientoService.actualizar(datos, id);
  }

  @Delete('/delete/:id')
  public eliminar(@Param('id') id: number) {
    return this.conocimientoService.eliminar(id);
  }
}
