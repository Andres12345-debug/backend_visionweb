import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CrearClienteDto } from './dto/clientes.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('clientes')
@UseGuards(AuthGuard, RolesGuard)
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Get('/todos')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public obtenerUsuarios() {
        return this.clientesService.consultar();
    }

    @Post('/agregar')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public registrarUsuario(@Body() datos: CrearClienteDto) {
        return this.clientesService.registrar(datos);
    }

    @Put('/actualizar/:id')
    @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
    public actualizar(
        @Param('id') id: number,
        @Body() datos: ActualizarClienteDto
    ) {
        return this.clientesService.actualizar(datos, id);
    }

    @Delete('/delete/:id')
    @Roles(ROLES.ADMINISTRADOR)
    public eliminar(@Param('id') id: number) {
        return this.clientesService.eliminar(id);
    }
}
