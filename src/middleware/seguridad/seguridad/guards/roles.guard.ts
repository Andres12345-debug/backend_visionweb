import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import RolHelper from '../helpers/rol.helper';
import { ROLES_KEY } from '../decoradores/roles.decorator';

// Debe ejecutarse después de AuthGuard: compara request.datosUsuario.rol contra @Roles(...)
@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}

    public canActivate(contexto: ExecutionContext): boolean {
        const rolesPermitidos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            contexto.getHandler(),
            contexto.getClass(),
        ]);

        if (!rolesPermitidos || rolesPermitidos.length === 0) {
            return true;
        }

        const { datosUsuario } = contexto.switchToHttp().getRequest();

        if (!RolHelper.tieneRol(datosUsuario?.rol, rolesPermitidos)) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
        }

        return true;
    }
}
