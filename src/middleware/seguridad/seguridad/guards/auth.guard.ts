import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

// Reemplaza al middleware Seguridad: valida el JWT y adjunta el payload a la request como datosUsuario
@Injectable()
export class AuthGuard implements CanActivate {
    public canActivate(contexto: ExecutionContext): boolean {
        const request = contexto.switchToHttp().getRequest();
        const authHeader = request.headers?.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Petición negada. Token requerido.');
        }

        try {
            const token = authHeader.replace('Bearer ', '').trim();
            const datosSesion = verify(token, process.env.JWT_SECRET ?? 'laClaveSecreta');

            request.datosUsuario = datosSesion;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
}
