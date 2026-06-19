import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConocimientoIA } from 'src/modelos/conocimiento-ia/conocimiento-ia';
import { AsistenteService } from './asistente.service';
import { AsistenteController } from './asistente.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConocimientoIA]),
  ],
  controllers: [AsistenteController],
  providers: [AsistenteService],
  exports: [AsistenteService],
})
export class AsistenteModule {}
