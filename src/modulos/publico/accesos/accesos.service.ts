import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import GenerarToken from 'src/utilities/shared/generarToken';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from '../registros/registro_sql';
import { LoginDto } from './dto/accesoDto';

@Injectable()
export class AccesosService {

    private accesoRepository: Repository<Acceso>;
    private usuarioRepository: Repository<Usuario>;

    constructor(private poolConexion: DataSource) {
        this.accesoRepository = poolConexion.getRepository(Acceso);
        this.usuarioRepository = poolConexion.getRepository(Usuario);
    }

    public async sesion(datosLogin: LoginDto): Promise<any> {

        const usuarioExiste = await this.usuarioRepository.findOne({
            where: { correoUsuario: datosLogin.correoUsuario },
            relations: ['acceso']
        });

        if (!usuarioExiste || !usuarioExiste.acceso) {
            throw new HttpException(
                "Usuario no registrado",
                HttpStatus.BAD_REQUEST
            );
        }

        const claveValida = compareSync(
            datosLogin.claveAcceso,
            usuarioExiste.acceso.claveAcceso
        );

        if (!claveValida) {
            throw new HttpException(
                "Las claves no coinciden",
                HttpStatus.UNAUTHORIZED
            );
        }

        try {

            const datosSesion = await this.accesoRepository.query(
                ACCESO_SQL.DATOS_SESION,
                [usuarioExiste.codUsuario]
            );

            const tokenSistema = GenerarToken.procesarRespuesta(datosSesion[0]);

            if (!tokenSistema) {
                throw new HttpException(
                    "Fallo al generar la autenticación",
                    HttpStatus.CONFLICT
                );
            }

            return {
                mensaje: "Inicio de sesión exitoso",
                tokenApp: tokenSistema
            };

        } catch (error) {
            throw new HttpException(
                "Fallo al consultar la información",
                HttpStatus.CONFLICT
            );
        }
    }
}