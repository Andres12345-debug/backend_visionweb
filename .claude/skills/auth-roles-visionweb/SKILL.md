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

## ⚠️ "Rol clientes" vs entidad `Clientes` — NO son lo mismo

El nombre "cliente" se usa para dos conceptos completamente distintos en este proyecto — no los confundas ni asumas que son redundantes:

- **Rol `clientes`** (`ROLES.CLIENTE`) — un nivel de acceso de una cuenta `Usuario` (login + JWT + permisos). Se asigna automáticamente al registrarse en `/publico/registros`.
- **Entidad/módulo `Clientes`** (`src/modelos/clientes`, `src/modulos/privado/clientes`) — fichas de **clientes de negocio tipo CRM** (NIT, empresa, dirección, país, etc.). NO tiene relación con `Usuario`/`Acceso`/`Rol`, no inicia sesión, no tiene token. Es información comercial gestionada por administradores/supervisores sobre los clientes de VisionWeb.

Si te piden "limpiar redundancia entre usuarios y clientes", verifica primero si se refieren al rol o a la entidad CRM — son cosas separadas y la entidad `Clientes` no debe eliminarse por esa confusión de nombres.

## JWT y secretos

- El secreto vive en `.env` como `JWT_SECRET` (y `JWT_EXPIRES_IN`), nunca hardcodeado. Se usa tanto en `AuthGuard` como en `src/utilities/shared/generarToken.ts`.
- El payload del JWT incluye `rol: nombre_rol` (nombre del rol desde la tabla `roles`, normalizado a minúsculas por `RolesService`) y `correo: correo_usuario` (claim `correo`, alimentado por `ACCESO_SQL.DATOS_SESION`).

## ⚠️ Login es por `correoUsuario`, NO por `nombreAcceso` (la entidad `Acceso` ya no tiene nombre propio)

Se eliminó el campo `nombreAcceso` de la entidad `Acceso` por ser redundante con `Usuario.nombreUsuario` — `Acceso` ahora solo guarda `codUsuario` + `claveAcceso` (es puramente la tabla de credenciales/contraseña).

- **Identificador único de login = `Usuario.correoUsuario`** (columna `correo_usuario`, `unique: true`, validada con `@IsEmail()`).
- `LoginDto` (`accesoDto.ts`) tiene `{ correoUsuario, claveAcceso }` — **no** `nombreAcceso`.
- `AccesosService.sesion()` busca el `Usuario` por `correoUsuario` (con `relations: ['acceso']`) y compara `claveAcceso` contra `usuario.acceso.claveAcceso` — ya no consulta `Acceso` directamente por nombre.
- `RegistroDto` tampoco tiene `nombreAcceso`; al registrar se valida unicidad por `correoUsuario` (no por nombre de acceso) y `Usuario.correoUsuario` se persiste junto con el resto de campos del usuario.
- `ACCESO_SQL.DATOS_SESION` (en `registros/registro_sql.ts`, compartida por registro y login) ya no hace `JOIN` con `accesos` — selecciona `correo_usuario` directo de `usuarios`.

Si ves código o ejemplos viejos con `nombreAcceso`/`nombre_acceso`, están desactualizados — reemplázalos por `correoUsuario`/`correo_usuario`.

📄 Guía completa de registro/login con ejemplos de petición/respuesta para el frontend: [frontend-auth-guide.md](frontend-auth-guide.md).

## Registro público (`/publico/registros`)

El alta pública SIEMPRE asigna el rol `clientes` automáticamente (busca el `codRol` por nombre vía `ROLES.CLIENTE` en `Rol`); el cliente **no** puede elegir su propio rol vía `codRol` en el DTO — esto evita que cualquiera se autoasigne `administradores`. Los roles `administradores`/`supervisores` solo se asignan desde `/privado/usuarios` por un administrador.

## ⚠️ Bootstrap del primer administrador (problema del huevo y la gallina)

`POST /usuarios/agregar` y todo `/roles/*` exigen `@Roles(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)`, y `seed.service.ts` solo siembra los **roles** (no un usuario admin). Resultado: **no existe ninguna ruta pública para crear el primer administrador** — necesitas un admin para crear un admin.

Solución de bootstrap (una sola vez, por base de datos): registra una cuenta normal vía `/publico/registros/user` (queda como `clientes`, pero ya con `Usuario` + `Acceso`/credenciales completos) y luego promuévela a mano cambiando su `cod_rol`:

```sql
UPDATE usuarios
SET cod_rol = (SELECT cod_rol FROM roles WHERE nombre_rol = 'administradores')
WHERE correo_usuario = 'correo@del-futuro-admin.com';
```

Después, esa cuenta debe **volver a iniciar sesión** (`/publico/accesos/signin`) — el JWT se genera con el rol vigente al momento del login (`ACCESO_SQL.DATOS_SESION` + `GenerarToken`), así que el token anterior sigue trayendo `rol: "clientes"` hasta que se loguea de nuevo. Con el nuevo token (`rol: "administradores"`) ya puede usar `/usuarios/agregar` y `/roles/*` con normalidad para crear más admins/supervisores por la vía oficial.

> Por qué actualizar el `Usuario` existente y no crear uno nuevo desde cero por SQL: así conservas el `Acceso` (credenciales ya hasheadas) generado por el flujo normal de registro, sin tener que fabricar un hash de `bcryptjs` a mano.

## ✅ Vía recomendada para crear admins/supervisores adicionales: registrar + promover

Una vez tienes un primer admin (vía bootstrap de arriba), **la forma correcta de dar de alta más administradores/supervisores con login funcional es**:

1. La persona se registra normal por `/publico/registros/user` (público, sin token) → queda como `clientes`, pero con `Usuario` **y** `Acceso` (credenciales) ya creados correctamente por el flujo transaccional de `RegistrosService`.
2. Un admin/supervisor existente la **promueve** cambiándole el `codRol` con `PUT /usuarios/actualizar/:id` (`ActualizarUsuarioDto` acepta `codRol?: number` como campo opcional — ver `actualizar-usuario.dto.ts`):
   - `PUT {{base_url}}/usuarios/actualizar/:id` con `Authorization: Bearer <token-del-admin>`
   - Body: `{ "codRol": <codRol de "administradores" o "supervisores"> }`
   - (consulta el `codRol` real con `GET {{base_url}}/roles/todos` — no asumas que es `1`/`2`/`3`, depende del orden de siembra)
3. La persona promovida debe **volver a iniciar sesión** para obtener un token con el nuevo `rol` (el JWT se genera con el rol vigente al momento del login, no se actualiza solo).

Esta vía es preferible a `POST /usuarios/agregar` porque **garantiza que la cuenta puede iniciar sesión** (tiene `Acceso` desde el principio).

### ⚠️ Por qué NO usar `POST /usuarios/agregar` para esto

`POST /usuarios/agregar` (`usuarios.service.ts → registrar()`) **solo crea el registro `Usuario`** — a diferencia de `/publico/registros/user`, **no crea `Acceso`** (sin credenciales, sin forma de hacer login ni de generar token). Aunque le pases `codRol` de `administradores` directamente en el body (`CrearUsuarioDto` lo exige), el resultado es un `Usuario` "fantasma": con el rol correcto pero sin manera de autenticarse — y hoy no existe un endpoint para darle `Acceso` después. Resérvalo solo para casos donde de verdad no se necesite login (poco común en este dominio).

## Seed de roles

`src/config/seed.service.ts` siembra los tres roles (`ROLES.ADMINISTRADOR`, `ROLES.SUPERVISOR`, `ROLES.CLIENTE`) al iniciar la app si no existen. Si agregas un nuevo rol al sistema, agrégalo aquí Y a `ROLES` en `rol.helper.ts`.
