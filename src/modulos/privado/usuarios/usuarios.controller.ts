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
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { UsuarioActual } from 'src/middleware/seguridad/seguridad/decoradores/usuario-actual.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
export class UsuariosController {

  constructor(private readonly usuarioService: UsuariosService) {}

  @Get('/todos')
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  public obtenerUsuarios() {
    return this.usuarioService.consultar();
  }

  @Get('/perfil')
  public async obtenerMiPerfil(@UsuarioActual() usuario: any) {
    return {
      mensaje: 'Perfil obtenido correctamente',
      usuario,
    };
  }

  @Post('/agregar')
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  public registrarUsuario(@Body() datos: CrearUsuarioDto) {
    return this.usuarioService.registrar(datos);
  }

  @Put('/actualizar/:id')
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
  public actualizar(
    @Param('id') id: number,
    @Body() datos: ActualizarUsuarioDto
  ) {
    return this.usuarioService.actualizar(datos, id);
  }

  @Delete('/delete/:id')
  @Roles(ROLES.ADMINISTRADOR)
  public eliminar(@Param('id') id: number) {
    return this.usuarioService.eliminar(id);
  }
}
