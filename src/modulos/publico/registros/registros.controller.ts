import { Body, Controller, Post } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistroDto } from './dto/registroDto';


@Controller('registros')
export class RegistrosController {

    constructor(private readonly registroService: RegistrosService){}

    @Post('/user')
    public async registrarUsuario(@Body() datosRegistro: RegistroDto): Promise<any> {
        return this.registroService.nuevoUsuario(datosRegistro);
    }
}