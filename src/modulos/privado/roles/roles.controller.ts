import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CrearRolDto } from './dto/crear-rol.dto';

@Controller('roles')
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

  @Put('/update/:id')
  public actualizar(
    @Param('id') id: number,
    @Body() datos: CrearRolDto
  ) {
    return this.rolesService.actualizar(datos, id);
  }

  @Delete('/delete/:id')
  public eliminar(@Param('id') id: number) {
    return this.rolesService.eliminar(id);
  }
}