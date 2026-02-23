import { Body, Controller, Post } from '@nestjs/common';
import { AccesosService } from './accesos.service';
import { LoginDto } from './dto/accesoDto';


@Controller('accesos')
export class AccesosController {

    constructor(private readonly accesosService: AccesosService) {}

    @Post('/signin')
    public async inicioSesion(@Body() datosLogin: LoginDto): Promise<any> {
        return this.accesosService.sesion(datosLogin);
    }
}