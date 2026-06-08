import { Module } from '@nestjs/common';
import { CorreosModule as CorreosPublicoModule } from '../../publico/correos/correos.module';
import { CorreosController } from './correos.controller';

@Module({
  imports: [CorreosPublicoModule],
  controllers: [CorreosController],
})
export class CorreosModule {}
