import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConocimientoIA } from 'src/modelos/conocimiento-ia/conocimiento-ia';
import { CrearConocimientoDto } from './dto/crear-conocimiento.dto';
import { ActualizarConocimientoDto } from './dto/actualizar-conocimiento.dto';

@Injectable()
export class ConocimientoService {

  constructor(
    @InjectRepository(ConocimientoIA) private readonly conocimientoRepo: Repository<ConocimientoIA>,
  ) {}

  public async consultar(): Promise<ConocimientoIA[]> {
    return this.conocimientoRepo.find({ order: { fecha: 'DESC' } });
  }

  public async existeAlguno(): Promise<boolean> {
    const total = await this.conocimientoRepo.count();
    return total > 0;
  }

  public async registrar(datos: CrearConocimientoDto) {
    const nuevo = this.conocimientoRepo.create(datos);
    const guardado = await this.conocimientoRepo.save(nuevo);

    return {
      mensaje: 'Conocimiento registrado correctamente',
      conocimiento: guardado,
    };
  }

  public async actualizar(datos: ActualizarConocimientoDto, id: number) {
    const conocimiento = await this.conocimientoRepo.findOneBy({ id });

    if (!conocimiento) {
      throw new HttpException('Conocimiento no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.conocimientoRepo.update(id, datos);

    return { mensaje: 'Conocimiento actualizado correctamente' };
  }

  public async eliminar(id: number) {
    const conocimiento = await this.conocimientoRepo.findOneBy({ id });

    if (!conocimiento) {
      throw new HttpException('Conocimiento no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.conocimientoRepo.delete(id);

    return { mensaje: 'Conocimiento eliminado correctamente' };
  }
}
