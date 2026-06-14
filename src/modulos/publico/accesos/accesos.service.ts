import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import GenerarToken from 'src/utilities/shared/generarToken';
import { Repository } from 'typeorm';
import { ACCESO_SQL } from '../registros/registro_sql';
import { LoginDto } from './dto/accesoDto';

@Injectable()
export class AccesosService {

    constructor(
        @InjectRepository(Acceso) private readonly accesoRepository: Repository<Acceso>,
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    ) {}

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