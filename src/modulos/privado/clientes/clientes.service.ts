import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Clientes } from 'src/modelos/clientes/clientes';
import { Repository } from 'typeorm';
import { CrearClienteDto } from './dto/clientes.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientesService {
    constructor(
    @InjectRepository(Clientes)
    private readonly clientesRepository: Repository<Clientes>,
  ) {}

  // 🔹 Consultar todos
  public async consultar(): Promise<Clientes[]> {
    return this.clientesRepository.find();
  }
 // 🔹 Verificar si existe
    public async verificarCliente(nombre: string): Promise<boolean> {
        const existe = await this.clientesRepository.findOne({
            where: { nombreCliente: nombre }
        });

        return !!existe;
    }
    // 🔹 Registrar
    public async registrar(datos: CrearClienteDto): Promise<any> {

        if (await this.verificarCliente(datos.nombreCliente)) {
            throw new HttpException(
                'El cliente ya existe',
                HttpStatus.CONFLICT
            );
        }
        const nuevoUsuario = this.clientesRepository.create({
            ...datos
        });

        const guardado = await this.clientesRepository.save(nuevoUsuario);

        return {
            mensaje: 'Usuario registrado correctamente',
            usuario: guardado
        };
    }
     // 🔹 Actualizar
      public async actualizar(datos: ActualizarClienteDto, id: number) {
    
        const usuario = await this.clientesRepository.findOneBy({
          codCliente: id
        });
    
        if (!usuario) {
          throw new HttpException(
            'Cliente no encontrado',
            HttpStatus.NOT_FOUND
          );
        }
    
        await this.clientesRepository.update(id, datos);
    
        return {
          mensaje: 'Cliente actualizado correctamente'
        };
      }
    
      // 🔹 Eliminar
      public async eliminar(id: number) {
    
        const usuario = await this.clientesRepository.findOneBy({
          codCliente: id
        });
    
        if (!usuario) {
          throw new HttpException(
            'Cliente no encontrado',
            HttpStatus.NOT_FOUND
          );
        }
    
        await this.clientesRepository.delete(id);
    
        return {
          mensaje: 'Cliente eliminado correctamente'
        };
      }


}
