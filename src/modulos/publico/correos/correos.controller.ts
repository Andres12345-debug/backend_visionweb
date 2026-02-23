import { Body, Controller, Post } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { ContactoDto } from './dto/contacto.dto';

@Controller('publico/correo')
export class CorreosController {

  constructor(private readonly correosService: CorreosService) {}

  @Post('contacto')
  async enviarCorreo(@Body() contactoDto: ContactoDto) {
    return this.correosService.enviarFormulario(contactoDto);
  }
}