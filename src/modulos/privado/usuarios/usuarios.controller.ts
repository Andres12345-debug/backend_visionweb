import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuariosController {

  constructor(private readonly usuarioService: UsuariosService) {}

  @Get('/todos')
  public obtenerUsuarios() {
    return this.usuarioService.consultar();
  }

  @Get('/perfil')
  public async obtenerMiPerfil(@Req() req: any) {
    return {
      mensaje: 'Perfil obtenido correctamente',
      usuario: req.datosUsuario,
    };
  }

  @Post('/agregar')
  public registrarUsuario(@Body() datos: CrearUsuarioDto) {
    return this.usuarioService.registrar(datos);
  }

  @Put('/actualizar/:id')
  public actualizar(
    @Param('id') id: number,
    @Body() datos: CrearUsuarioDto
  ) {
    return this.usuarioService.actualizar(datos, id);
  }

  @Delete('/delete/:id')
  public eliminar(@Param('id') id: number) {
    return this.usuarioService.eliminar(id);
  }
}