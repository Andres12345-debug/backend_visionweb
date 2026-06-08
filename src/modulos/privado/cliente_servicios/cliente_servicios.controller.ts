import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClienteServiciosService } from './cliente_servicios.service';
import { CrearClienteServicioDto } from './dto/crear-cliente-servicio.dto';
import { ActualizarClienteServicioDto } from './dto/actualizar-cliente-servicio.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { UsuarioActual } from 'src/middleware/seguridad/seguridad/decoradores/usuario-actual.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('cliente-servicios')
@UseGuards(AuthGuard, RolesGuard)
export class ClienteServiciosController {
    constructor(private readonly clienteServiciosService: ClienteServiciosService) { }

    @Get('/todos')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public listar() {
        return this.clienteServiciosService.consultar();
    }

    @Get('/mios')
    @Roles(ROLES.CLIENTE)
    public misContratosActivos(@UsuarioActual() usuario: any) {
        return this.clienteServiciosService.consultarPropiosActivos(usuario.id);
    }

    @Get('/:id')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public consultarUno(@Param('id') id: number) {
        return this.clienteServiciosService.consultarUno(id);
    }

    @Post('/agregar')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public registrar(@Body() datos: CrearClienteServicioDto) {
        return this.clienteServiciosService.registrar(datos);
    }

    @Put('/actualizar/:id')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public actualizar(
        @Param('id') id: number,
        @Body() datos: ActualizarClienteServicioDto
    ) {
        return this.clienteServiciosService.actualizar(datos, id);
    }

    @Delete('/delete/:id')
    @Roles(ROLES.ADMINISTRADOR)
    public eliminar(@Param('id') id: number) {
        return this.clienteServiciosService.eliminar(id);
    }
}
