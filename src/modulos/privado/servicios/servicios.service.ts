import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicios } from 'src/modelos/servicios/servicios';
import { CrearServicioDto } from './dto/crear-servicio.dto';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto';

@Injectable()
export class ServiciosService {
    constructor(
        @InjectRepository(Servicios)
        private readonly serviciosRepository: Repository<Servicios>,
    ) { }

    // 🔹 Consultar todos
    public async consultar(): Promise<Servicios[]> {
        return this.serviciosRepository.find();
    }

    // 🔹 Consultar uno
    public async consultarUno(id: number): Promise<Servicios> {
        const servicio = await this.serviciosRepository.findOneBy({ codServicio: id });

        if (!servicio) {
            throw new HttpException('Servicio no encontrado', HttpStatus.NOT_FOUND);
        }

        return servicio;
    }

    // 🔹 Verificar si existe
    public async verificarServicio(nombre: string): Promise<boolean> {
        const existe = await this.serviciosRepository.findOne({
            where: { nombreServicio: nombre }
        });

        return !!existe;
    }

    // 🔹 Registrar
    public async registrar(datos: CrearServicioDto): Promise<any> {

        if (await this.verificarServicio(datos.nombreServicio)) {
            throw new HttpException(
                'El servicio ya existe',
                HttpStatus.CONFLICT
            );
        }

        const nuevoServicio = this.serviciosRepository.create({
            ...datos
        });

        const guardado = await this.serviciosRepository.save(nuevoServicio);

        return {
            mensaje: 'Servicio registrado correctamente',
            servicio: guardado
        };
    }

    // 🔹 Actualizar
    public async actualizar(datos: ActualizarServicioDto, id: number) {

        const servicio = await this.serviciosRepository.findOneBy({
            codServicio: id
        });

        if (!servicio) {
            throw new HttpException(
                'Servicio no encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        await this.serviciosRepository.update(id, datos);

        return {
            mensaje: 'Servicio actualizado correctamente'
        };
    }

    // 🔹 Eliminar
    public async eliminar(id: number) {

        const servicio = await this.serviciosRepository.findOneBy({
            codServicio: id
        });

        if (!servicio) {
            throw new HttpException(
                'Servicio no encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        await this.serviciosRepository.delete(id);

        return {
            mensaje: 'Servicio eliminado correctamente'
        };
    }
}
