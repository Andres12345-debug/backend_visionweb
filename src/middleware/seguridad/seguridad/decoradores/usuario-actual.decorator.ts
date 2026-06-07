import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Inyecta el payload del JWT (adjuntado por AuthGuard) en lugar de usar @Req() req.datosUsuario
export const UsuarioActual = createParamDecorator(
    (_datos: unknown, contexto: ExecutionContext) => {
        const request = contexto.switchToHttp().getRequest();
        return request.datosUsuario;
    },
);
