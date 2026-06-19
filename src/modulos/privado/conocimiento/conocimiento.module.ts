import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConocimientoIA } from 'src/modelos/conocimiento-ia/conocimiento-ia';
import { ConocimientoService } from './conocimiento.service';
import { ConocimientoController } from './conocimiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConocimientoIA])],
  providers: [ConocimientoService],
  controllers: [ConocimientoController],
  exports: [ConocimientoService],
})
export class ConocimientoModule {}
