import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ActualizarRolDto } from './dto/actualizar-rol.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLES.ADMINISTRADOR)
export class RolesController {

  constructor(private readonly rolesService: RolesService) {}

  @Get('/todos')
  public consultar() {
    return this.rolesService.consultar();
  }

  @Post('/agregar')
  public registrar(@Body() datos: CrearRolDto) {
    return this.rolesService.registrar(datos);
  }

  @Get('/one/:id')
  public consultarUno(@Param('id') id: number) {
    return this.rolesService.consultarUno(id);
  }

  @Put('/actualizar/:id')
  public actualizar(
    @Param('id') id: number,
    @Body() datos: ActualizarRolDto
  ) {
    return this.rolesService.actualizar(datos, id);
  }

  @Delete('/delete/:id')
  public eliminar(@Param('id') id: number) {
    return this.rolesService.eliminar(id);
  }
}
