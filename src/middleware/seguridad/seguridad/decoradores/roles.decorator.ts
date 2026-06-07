import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Marca qué roles pueden acceder a un endpoint. Sin este decorador, RolesGuard solo exige autenticación.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
