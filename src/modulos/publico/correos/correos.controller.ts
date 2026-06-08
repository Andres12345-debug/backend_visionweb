import { Body, Controller, Post } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { ContactoDto } from './dto/contacto.dto';

@Controller('correos')
export class CorreosController {

  constructor(private readonly correosService: CorreosService) { }

  // Formulario público de contacto del sitio: sin guard
  @Post('contacto')
  async enviarCorreo(@Body() contactoDto: ContactoDto) {
    return this.correosService.enviarFormulario(contactoDto);
  }
}
