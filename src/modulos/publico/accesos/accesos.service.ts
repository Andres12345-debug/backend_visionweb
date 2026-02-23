import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import GenerarToken from 'src/utilities/shared/generarToken';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from '../registros/registro_sql';
import { LoginDto } from './dto/accesoDto';

@Injectable()
export class AccesosService {

    private accesoRepository: Repository<Acceso>;

    constructor(private poolConexion: DataSource) {
        this.accesoRepository = poolConexion.getRepository(Acceso);
    }

    public async sesion(datosLogin: LoginDto): Promise<any> {

        const usuarioExiste = await this.accesoRepository.findOne({
            where: { nombreAcceso: datosLogin.nombreAcceso }
        });

        if (!usuarioExiste) {
            throw new HttpException(
                "Usuario no registrado",
                HttpStatus.BAD_REQUEST
            );
        }

        const claveValida = compareSync(
            datosLogin.claveAcceso,
            usuarioExiste.claveAcceso
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