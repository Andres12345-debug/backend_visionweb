import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CrearClienteDto } from './dto/clientes.dto';

@Controller('clientes')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Get('/todos')
    public obtenerUsuarios() {
        return this.clientesService.consultar();
    }

    @Post('/agregar')
    public registrarUsuario(@Body() datos: CrearClienteDto) {
        return this.clientesService.registrar(datos);
    }
    @Put('/actualizar/:id')
    public actualizar(
        @Param('id') id: number,
        @Body() datos: CrearClienteDto
    ) {
        return this.clientesService.actualizar(datos, id);
    }

    @Delete('/delete/:id')
    public eliminar(@Param('id') id: number) {
        return this.clientesService.eliminar(id);
    }

}
