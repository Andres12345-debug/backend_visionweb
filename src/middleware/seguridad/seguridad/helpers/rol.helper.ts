// Fuente única de verdad para los nombres de rol usados por @Roles() y RolesGuard
export const ROLES = {
    ADMINISTRADOR: 'administradores',
    SUPERVISOR: 'supervisores',
    CLIENTE: 'clientes',
} as const;

export type RolNombre = typeof ROLES[keyof typeof ROLES];

class RolHelper {
    public static normalizar(rol: string): string {
        return rol?.trim().toLowerCase() ?? '';
    }

    public static tieneRol(rolUsuario: string, rolesPermitidos: string[]): boolean {
        if (!rolUsuario || rolesPermitidos.length === 0) {
            return false;
        }

        const rolNormalizado = RolHelper.normalizar(rolUsuario);

        return rolesPermitidos.some(
            (rolPermitido) => RolHelper.normalizar(rolPermitido) === rolNormalizado
        );
    }
}

export default RolHelper;
