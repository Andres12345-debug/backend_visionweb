import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/modelos/usuario/usuario';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // 🔹 Consultar todos
  public async consultar(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['codRolU']
    });
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

  // 🔹 Consultar perfil del usuario autenticado
  public async consultarPerfil(id: number): Promise<any> {

    const usuario = await this.usuarioRepository.findOne({
      where: { codUsuario: id },
      relations: ['codRolU']
    });

    if (!usuario) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    return {
      codUsuario: usuario.codUsuario,
      nombreUsuario: usuario.nombreUsuario,
      correoUsuario: usuario.correoUsuario,
      fechaNacimientoUsuario: usuario.fechaNacimientoUsuario,
      telefonoUsuario: usuario.telefonoUsuario,
      generoUsuario: usuario.generoUsuario,
      empresaUsuario: usuario.empresaUsuario,
      codRol: usuario.codRol,
      rolNombre: usuario.codRolU?.nombreRol
    };
  }

  // 🔹 Actualizar perfil del usuario autenticado
  public async actualizarPerfil(id: number, datos: ActualizarPerfilDto) {

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
      mensaje: 'Perfil actualizado correctamente'
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