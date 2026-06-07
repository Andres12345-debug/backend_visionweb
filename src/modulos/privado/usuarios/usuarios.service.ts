import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/modelos/usuario/usuario';
import { DataSource, Repository } from 'typeorm';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {

  private usuarioRepository: Repository<Usuario>;

  constructor(private poolConexion: DataSource) {
    this.usuarioRepository = poolConexion.getRepository(Usuario);
  }

  // 🔹 Consultar todos
  public async consultar(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  // 🔹 Verificar si existe
  public async verificarUsuario(nombre: string): Promise<boolean> {
    const existe = await this.usuarioRepository.findOne({
      where: { nombreUsuario: nombre }
    });

    return !!existe;
  } 

  // 🔹 Registrar
  public async registrar(datos: CrearUsuarioDto): Promise<any> {

    if (await this.verificarUsuario(datos.nombreUsuario)) {
      throw new HttpException(
        'El usuario ya existe',
        HttpStatus.CONFLICT
      );
    }

    const nuevoUsuario = this.usuarioRepository.create({
      ...datos
    });

    const guardado = await this.usuarioRepository.save(nuevoUsuario);

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: guardado
    };
  }

  // 🔹 Actualizar
  public async actualizar(datos: ActualizarUsuarioDto, id: number) {

    const usuario = await this.usuarioRepository.findOneBy({
      codUsuario: id
    });

    if (!usuario) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    await this.usuarioRepository.update(id, datos);

    return {
      mensaje: 'Usuario actualizado correctamente'
    };
  }

  // 🔹 Eliminar
  public async eliminar(id: number) {

    const usuario = await this.usuarioRepository.findOneBy({
      codUsuario: id
    });

    if (!usuario) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    await this.usuarioRepository.delete(id);

    return {
      mensaje: 'Usuario eliminado correctamente'
    };
  }
}