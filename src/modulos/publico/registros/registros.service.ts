import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from './registro_sql';
import GenerarToken from 'src/utilities/shared/generarToken';
import { RegistroDto } from './dto/registroDto';

@Injectable()
export class RegistrosService {

  private usuarioRepositorio: Repository<Usuario>;
  private AccesoRepositorio: Repository<Acceso>;

  constructor(private poolConexion: DataSource) {
    this.usuarioRepositorio = poolConexion.getRepository(Usuario);
    this.AccesoRepositorio = poolConexion.getRepository(Acceso);
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

      // 2️⃣ Crear Usuario (INCLUIMOS CAMPOS NOT NULL)
      const nuevoUsuario = this.usuarioRepositorio.create({
        nombreUsuario: datosRegistro.nombreUsuario,
        telefonoUsuario: datosRegistro.telefonoUsuario,
        fechaNacimientoUsuario: datosRegistro.fechaNacimientoUsuario,
        generoUsuario: datosRegistro.generoUsuario,
        codRol: datosRegistro.codRol
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