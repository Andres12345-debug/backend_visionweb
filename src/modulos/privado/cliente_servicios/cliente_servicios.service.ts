import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ClienteServicios } from 'src/modelos/cliente_servicios/cliente_servicios';
import { Usuario } from 'src/modelos/usuario/usuario';
import { CrearClienteServicioDto } from './dto/crear-cliente-servicio.dto';
import { ActualizarClienteServicioDto } from './dto/actualizar-cliente-servicio.dto';

@Injectable()
export class ClienteServiciosService {
    constructor(
        @InjectRepository(ClienteServicios)
        private readonly clienteServiciosRepository: Repository<ClienteServicios>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    // 🔹 Consultar todos
    public async consultar(): Promise<ClienteServicios[]> {
        return this.clienteServiciosRepository.find({
            relations: ['usuario', 'servicio']
        });
    }

    // 🔹 Consultar uno
    public async consultarUno(id: number): Promise<ClienteServicios> {
        const clienteServicio = await this.clienteServiciosRepository.findOne({
            where: { codClienteServicio: id },
            relations: ['usuario', 'servicio']
        });

        if (!clienteServicio) {
            throw new HttpException('Servicio de cliente no encontrado', HttpStatus.NOT_FOUND);
        }

        return clienteServicio;
    }

    // 🔹 Consultar los contratos activos del usuario autenticado
    public async consultarPropiosActivos(codUsuario: number): Promise<ClienteServicios[]> {
        return this.clienteServiciosRepository.find({
            where: {
                codUsuario,
                estado: ILike('activo')
            },
            relations: ['usuario', 'servicio'],
            order: { fechaInicio: 'DESC' }
        });
    }

    // 🔹 Registrar
    public async registrar(datos: CrearClienteServicioDto): Promise<any> {

        const usuario = await this.usuarioRepository.findOneBy({ codUsuario: datos.codUsuario });

        if (!usuario) {
            throw new HttpException('El usuario indicado no existe', HttpStatus.NOT_FOUND);
        }

        const nuevoClienteServicio = this.clienteServiciosRepository.create({
            ...datos
        });

        const guardado = await this.clienteServiciosRepository.save(nuevoClienteServicio);

        return {
            mensaje: 'Servicio asignado al cliente correctamente',
            clienteServicio: guardado
        };
    }

    // 🔹 Actualizar
    public async actualizar(datos: ActualizarClienteServicioDto, id: number) {

        const clienteServicio = await this.clienteServiciosRepository.findOneBy({
            codClienteServicio: id
        });

        if (!clienteServicio) {
            throw new HttpException(
                'Servicio de cliente no encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        await this.clienteServiciosRepository.update(id, datos);

        return {
            mensaje: 'Servicio de cliente actualizado correctamente'
        };
    }

    // 🔹 Eliminar
    public async eliminar(id: number) {

        const clienteServicio = await this.clienteServiciosRepository.findOneBy({
            codClienteServicio: id
        });

        if (!clienteServicio) {
            throw new HttpException(
                'Servicio de cliente no encontrado',
                HttpStatus.NOT_FOUND
            );
        }

        await this.clienteServiciosRepository.delete(id);

        return {
            mensaje: 'Servicio de cliente eliminado correctamente'
        };
    }
}
