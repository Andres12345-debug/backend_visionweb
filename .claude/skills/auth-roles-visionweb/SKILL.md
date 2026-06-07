---
name: auth-roles-visionweb
description: Use when adding or modifying endpoints/modules in this NestJS backend (VisionWeb) that need authentication or role-based access control (administradores, supervisores, clientes), or when creating/updating DTOs for create/update operations. Covers the guard+decorator+rol.helper pattern that replaced the old global middleware.
---

# Autenticación y roles en VisionWeb (guard + decoradores + rol.helper)

Este backend NO usa middleware global para auth — usa **guards de Nest + decoradores + un helper de roles**. Sigue este patrón siempre que agregues o cambies endpoints protegidos.

## Piezas clave (en `src/middleware/seguridad/seguridad/`)

- `helpers/rol.helper.ts` — exporta `ROLES = { ADMINISTRADOR: 'administradores', SUPERVISOR: 'supervisores', CLIENTE: 'clientes' }` y `RolHelper.tieneRol(rolUsuario, rolesPermitidos)`. **Única fuente de verdad** para nombres de rol — nunca compares strings de rol "a mano".
- `guards/auth.guard.ts` — `AuthGuard`: valida el JWT (`Authorization: Bearer ...`, `process.env.JWT_SECRET`) y adjunta el payload a `request.datosUsuario`.
- `guards/roles.guard.ts` — `RolesGuard`: lee la metadata `@Roles(...)` con `Reflector` y compara contra `request.datosUsuario.rol` usando `RolHelper.tieneRol`. Si el endpoint no tiene `@Roles()`, solo exige autenticación.
- `decoradores/roles.decorator.ts` — `@Roles(...roles: string[])`, p. ej. `@Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)`.
- `decoradores/usuario-actual.decorator.ts` — `@UsuarioActual()`: inyecta `request.datosUsuario` en el handler (reemplaza `@Req() req: any` + `req.datosUsuario`).

## Cómo proteger un controlador nuevo

```ts
import { AuthGuard } from 'src/middleware/seguridad/seguridad/guards/auth.guard';
import { RolesGuard } from 'src/middleware/seguridad/seguridad/guards/roles.guard';
import { Roles } from 'src/middleware/seguridad/seguridad/decoradores/roles.decorator';
import { UsuarioActual } from 'src/middleware/seguridad/seguridad/decoradores/usuario-actual.decorator';
import { ROLES } from 'src/middleware/seguridad/seguridad/helpers/rol.helper';

@Controller('algo')
@UseGuards(AuthGuard, RolesGuard)   // exige token válido en TODO el controlador
export class AlgoController {

  @Get('/todos')
  @Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)   // solo estos roles
  listar() { ... }

  @Get('/perfil')
  miPerfil(@UsuarioActual() usuario: any) { ... } // sin @Roles(): cualquier autenticado

  @Delete('/delete/:id')
  @Roles(ROLES.ADMINISTRADOR)   // operaciones destructivas: solo admin
  eliminar() { ... }
}
```

Reglas de orden:
- `AuthGuard` siempre antes que `RolesGuard` en `@UseGuards(...)` (Roles depende de que `datosUsuario` ya exista).
- `@UseGuards` puede ir a nivel de clase (protege todo) o de método. `@Roles` se puede poner a nivel de clase (ej. módulo `roles`, admin-only) o de método para variar por endpoint.
- Las rutas públicas (`/publico/*` como `accesos/signin`, `registros/user`, `correos/contacto`) **no** llevan estos guards.

## Tabla de acceso vigente (referencia — actualízala si cambian las reglas)

| Módulo | Administradores | Supervisores | Clientes |
|---|---|---|---|
| `usuarios` | CRUD completo | listar/crear/actualizar (no eliminar) | solo `/perfil` propio |
| `roles` | CRUD completo | sin acceso | sin acceso |
| `clientes` | CRUD completo | listar/crear/actualizar (no eliminar) | sin acceso |
| `correos` (listar/ver/responder) | acceso completo | acceso completo | sin acceso (`/contacto` es público) |

Patrón general: **eliminar** y operaciones sensibles → solo `ADMINISTRADOR`; lectura/creación/edición operativa → `ADMINISTRADOR` + `SUPERVISOR`; el rol `CLIENTE` solo ve sus propios datos vía endpoints tipo `/perfil`.

## Convención de DTOs: Crear vs Actualizar

Cada módulo CRUD tiene **dos DTOs separados** (no reutilizar el de creación para actualizar):

- `crear-x.dto.ts` → `CrearXDto`: campos obligatorios con `@IsNotEmpty()`.
- `actualizar-x.dto.ts` → `ActualizarXDto`: los MISMOS campos pero todos `@IsOptional()` (más el validador de tipo correspondiente), para permitir updates parciales sin reenviar el objeto completo.

No se usa `@nestjs/mapped-types`/`PartialType` (no está instalado) — se escriben los DTOs de actualización a mano para no añadir dependencias.

## JWT y secretos

- El secreto vive en `.env` como `JWT_SECRET` (y `JWT_EXPIRES_IN`), nunca hardcodeado. Se usa tanto en `AuthGuard` como en `src/utilities/shared/generarToken.ts`.
- El payload del JWT incluye `rol: nombre_rol` (nombre del rol desde la tabla `roles`, normalizado a minúsculas por `RolesService`).

## Registro público (`/publico/registros`)

El alta pública SIEMPRE asigna el rol `clientes` automáticamente (busca el `codRol` por nombre vía `ROLES.CLIENTE` en `Rol`); el cliente **no** puede elegir su propio rol vía `codRol` en el DTO — esto evita que cualquiera se autoasigne `administradores`. Los roles `administradores`/`supervisores` solo se asignan desde `/privado/usuarios` por un administrador.

## Seed de roles

`src/config/seed.service.ts` siembra los tres roles (`ROLES.ADMINISTRADOR`, `ROLES.SUPERVISOR`, `ROLES.CLIENTE`) al iniciar la app si no existen. Si agregas un nuevo rol al sistema, agrégalo aquí Y a `ROLES` en `rol.helper.ts`.
