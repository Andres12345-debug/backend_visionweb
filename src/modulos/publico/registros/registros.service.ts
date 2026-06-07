import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  private usuarioRepositorio: Repository<Usuario>;
  private AccesoRepositorio: Repository<Acceso>;
  private rolRepositorio: Repository<Rol>;

  constructor(private poolConexion: DataSource) {
    this.usuarioRepositorio = poolConexion.getRepository(Usuario);
    this.AccesoRepositorio = poolConexion.getRepository(Acceso);
    this.rolRepositorio = poolConexion.getRepository(Rol);
  }

  public async nuevoUsuario(datosRegistro: RegistroDto): Promise<any> {

    // 🔥 Usamos transacción para evitar datos huérfanos
    const queryRunner = this.poolConexion.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // 1️⃣ Verificar si usuario ya existe
      const usuarioExiste = await this.AccesoRepositorio.findOne({
        where: { nombreAcceso: datosRegistro.nombreAcceso }
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
        telefonoUsuario: datosRegistro.telefonoUsuario,
        fechaNacimientoUsuario: datosRegistro.fechaNacimientoUsuario,
        generoUsuario: datosRegistro.generoUsuario,
        codRol: rolCliente.codRol
      });

      const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

      // 3️⃣ Crear Acceso
      const claveCifrada = hashSync(datosRegistro.claveAcceso, 10);

      const nuevoAcceso = this.AccesoRepositorio.create({
        codUsuario: usuarioGuardado.codUsuario,
        nombreAcceso: datosRegistro.nombreAcceso,
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

      throw new HttpException(
        'Fallo al registrar el usuario',
        HttpStatus.CONFLICT
      );

    } finally {
      await queryRunner.release();
    }
  }
}