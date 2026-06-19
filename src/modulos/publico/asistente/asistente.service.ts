import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Groq from 'groq-sdk';
import { Repository } from 'typeorm';
import { ConocimientoIA } from 'src/modelos/conocimiento-ia/conocimiento-ia';
import { MensajeHistorialDto } from './dto/pregunta-asistente.dto';

const SYSTEM_PROMPT_BASE = `Eres el asistente virtual de VisionWeb, una empresa colombiana especializada en soluciones tecnológicas empresariales Open Source.

Reglas de comportamiento:
- Responde siempre en español, de forma clara, amable y profesional.
- Si te preguntan algo fuera del ámbito de VisionWeb o TI empresarial, responde: "Esa pregunta está fuera de mi área de conocimiento. ¿Puedo ayudarle con algo relacionado con nuestros servicios de mesa de ayuda o gestión de inventario TI?"
- Para solicitar una demo o cotización, indica que pueden escribir al WhatsApp +57 300 753 8453 o usar el formulario de contacto.
- No inventes precios ni fechas. Si no sabes un dato específico, deriva al equipo de ventas.
- Respuestas cortas y directas, máximo 3 párrafos.`;

@Injectable()
export class AsistenteService {

  private readonly groq: Groq;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ConocimientoIA) private readonly conocimientoRepo: Repository<ConocimientoIA>,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY') ?? '',
    });
  }

  async responder(pregunta: string, historial: MensajeHistorialDto[] = []): Promise<string> {

    const baseConocimiento = await this.conocimientoRepo.find({
      where: { activo: true },
    });

    const contextoConocimiento = baseConocimiento
      .map((item) => `- ${item.titulo}: ${item.contenido}`)
      .join('\n');

    const systemPrompt = contextoConocimiento
      ? `${SYSTEM_PROMPT_BASE}\n\nInformación de VisionWeb que puedes usar para responder:\n${contextoConocimiento}`
      : SYSTEM_PROMPT_BASE;

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...historial.map((m) => ({
            role: m.role === 'model' ? ('assistant' as const) : ('user' as const),
            content: m.text,
          })),
          { role: 'user', content: pregunta },
        ],
        temperature: 0.7,
        max_tokens: 512,
      });

      return response.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      const status = error?.status ?? error?.error?.code ?? '';
      if (String(status).includes('429') || String(status).includes('rate_limit')) {
        throw new HttpException('rate_limit', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw error;
    }
  }
}
