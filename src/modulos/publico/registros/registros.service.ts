import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import { Rol } from 'src/modelos/rol/rol';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from './registro_sql';
import GenerarToken from 'src/utilities/shared/generarToken';
import { RegistroDto } from './dto/registroDto';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Injectable()
export class RegistrosService {

  constructor(
    private readonly poolConexion: DataSource,
    @InjectRepository(Usuario) private readonly usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Acceso) private readonly AccesoRepositorio: Repository<Acceso>,
    @InjectRepository(Rol) private readonly rolRepositorio: Repository<Rol>,
  ) {}

  public async nuevoUsuario(datosRegistro: RegistroDto): Promise<any> {

    // 🔥 Usamos transacción para evitar datos huérfanos
    const queryRunner = this.poolConexion.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // 1️⃣ Verificar si usuario ya existe
      const usuarioExiste = await this.usuarioRepositorio.findOne({
        where: { correoUsuario: datosRegistro.correoUsuario }
      });

      if (usuarioExiste) {
        throw new HttpException(
          'El usuario ya existe',
          HttpStatus.NOT_ACCEPTABLE
        );
      }

      // El registro público siempre crea usuarios con rol "clientes":
      // asignar administradores/supervisores es tarea de un administrador desde /privado/usuarios
      const rolCliente = await this.rolRepositorio.findOne({
        where: { nombreRol: ROLES.CLIENTE }
      });

      if (!rolCliente) {
        throw new HttpException(
          'El rol de clientes no está configurado',
          HttpStatus.CONFLICT
        );
      }

      // 2️⃣ Crear Usuario (INCLUIMOS CAMPOS NOT NULL)
      const nuevoUsuario = this.usuarioRepositorio.create({
        nombreUsuario: datosRegistro.nombreUsuario,
        correoUsuario: datosRegistro.correoUsuario,
        telefonoUsuario: datosRegistro.telefonoUsuario,
        fechaNacimientoUsuario: datosRegistro.fechaNacimientoUsuario,
        generoUsuario: datosRegistro.generoUsuario,
        empresaUsuario: datosRegistro.empresaUsuario,
        codRol: rolCliente.codRol
      });

      const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

      // 3️⃣ Crear Acceso
      const claveCifrada = hashSync(datosRegistro.claveAcceso, 10);

      const nuevoAcceso = this.AccesoRepositorio.create({
        codUsuario: usuarioGuardado.codUsuario,
        claveAcceso: claveCifrada
      });

      await queryRunner.manager.save(nuevoAcceso);

      // 4️⃣ Confirmar transacción
      await queryRunner.commitTransaction();

      // 5️⃣ Generar Token
      const datosSesion = await this.AccesoRepositorio.query(
        ACCESO_SQL.DATOS_SESION,
        [usuarioGuardado.codUsuario]
      );

      const token = GenerarToken.procesarRespuesta(datosSesion[0]);

      return {
        mensaje: "Usuario registrado correctamente",
        tokenApp: token
      };

    } catch (error) {

      // 🔥 Si algo falla, deshacemos todo
      await queryRunner.rollbackTransaction();

      console.error("ERROR REGISTRO:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Fallo al registrar el usuario',
        HttpStatus.CONFLICT
      );

    } finally {
      await queryRunner.release();
    }
  }
}