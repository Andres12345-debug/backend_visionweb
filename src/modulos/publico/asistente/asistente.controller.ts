import { Body, Controller, Post } from '@nestjs/common';
import { AsistenteService } from './asistente.service';
import { PreguntaAsistenteDto } from './dto/pregunta-asistente.dto';

@Controller('asistente')
export class AsistenteController {

  constructor(private readonly asistenteService: AsistenteService) { }

  // Preguntas del asistente IA desde el sitio web: sin guard
  @Post('pregunta')
  async preguntar(@Body() dto: PreguntaAsistenteDto) {
    const respuesta = await this.asistenteService.responder(dto.pregunta, dto.historial);
    return { respuesta };
  }
}
