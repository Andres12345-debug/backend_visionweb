import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { Agent } from 'https';
import { AsistenteService } from '../asistente/asistente.service';

// Fuerza IPv4 para evitar timeouts en redes donde la salida IPv6 no tiene ruta
const agenteIPv4 = new Agent({ family: 4, keepAlive: true });

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly asistenteService: AsistenteService,
  ) { }

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN no configurado: el bot de Telegram no se iniciará.');
      return;
    }

    this.bot = new Telegraf(token, { telegram: { agent: agenteIPv4 } });

    this.bot.on('text', async (ctx) => {
      try {
        const respuesta = await this.asistenteService.responder(ctx.message.text);
        await ctx.reply(respuesta);
      } catch (error) {
        this.logger.error('Error procesando mensaje de Telegram', error as Error);
        await ctx.reply('Ocurrió un error procesando tu pregunta, por favor intenta de nuevo.');
      }
    });

    this.bot.launch()
      .then(() => this.logger.log('Bot de Telegram iniciado correctamente.'))
      .catch((error) => {
        this.logger.error('No se pudo iniciar el bot de Telegram (la web sigue funcionando con normalidad).', error as Error);
      });
  }

  onModuleDestroy() {
    this.bot?.stop('SIGTERM');
  }
}
