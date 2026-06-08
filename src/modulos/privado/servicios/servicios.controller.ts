import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('servicios')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) { }

    @Get('/todos')
    public listar() {
        return this.serviciosService.consultar();
    }

    @Get('/:id')
    public consultarUno(@Param('id') id: number) {
        return this.serviciosService.consultarUno(id);
    }

    @Post('/agregar')
    public registrar(@Body() datos: CrearServicioDto) {
        return this.serviciosService.registrar(datos);
    }

    @Put('/actualizar/:id')
    public actualizar(
        @Param('id') id: number,
        @Body() datos: ActualizarServicioDto
    ) {
        return this.serviciosService.actualizar(datos, id);
    }

    @Delete('/delete/:id')
    @Roles(ROLES.ADMINISTRADOR)
    public eliminar(@Param('id') id: number) {
        return this.serviciosService.eliminar(id);
    }
}
