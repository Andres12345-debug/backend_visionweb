import { Body, Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { ContactoDto } from './dto/contacto.dto';
import { ResponderCorreoDto } from './dto/responderCorreo.dto';

@Controller('correos')
export class CorreosController {

  constructor(private readonly correosService: CorreosService) { }

  @Post('contacto')
  async enviarCorreo(@Body() contactoDto: ContactoDto) {
    return this.correosService.enviarFormulario(contactoDto);
  }

  // 🔥 GET TODOS
  @Get()
  async listarCorreos() {
    return this.correosService.obtenerCorreos();
  }

  // 🔥 GET POR ID
  @Get(':id')
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.correosService.obtenerCorreoPorId(id);
  }

  @Post('responder')
  async responderCorreo(@Body() datos: ResponderCorreoDto) {
    return this.correosService.responderCorreo(datos);
  }
}