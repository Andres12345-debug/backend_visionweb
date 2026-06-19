import { Module } from '@nestjs/common';
import { AsistenteModule } from '../asistente/asistente.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [AsistenteModule],
  providers: [TelegramService],
})
export class TelegramModule {}
