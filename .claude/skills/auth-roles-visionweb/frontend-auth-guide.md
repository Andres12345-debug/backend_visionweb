# Guía de autenticación para frontend (registro e inicio de sesión)

Referencia rápida de los dos endpoints públicos de autenticación de VisionWeb, pensada para quien construye el cliente (web/móvil). Basada en `src/modulos/publico/registros` y `src/modulos/publico/accesos`.

Ambos cuelgan del prefijo `publico` (ver `publico.module.ts` → `RouterModule.register`):

- `POST {{base_url}}/publico/registros/user` — crear cuenta
- `POST {{base_url}}/publico/accesos/signin` — iniciar sesión

No requieren `Authorization` (son rutas públicas, sin `AuthGuard`/`RolesGuard`).

---

## 1. Registro — `POST /publico/registros/user`

Crea un `Usuario` + sus credenciales (`Acceso`) en una sola transacción. **Siempre** asigna el rol `clientes` automáticamente — el cliente no puede elegir su rol (ver `RegistrosService.nuevoUsuario`).

### Body (`RegistroDto`)

```json
{
  "nombreUsuario": "Andres Pérez",
  "fechaNacimientoUsuario": "2000-08-18",
  "generoUsuario": 1,
  "telefonoUsuario": "3007538453",
  "correoUsuario": "andres@example.com",
  "claveAcceso": "Keillter@30"
}
```

| Campo | Tipo / validación | Notas |
|---|---|---|
| `nombreUsuario` | `string`, no vacío | Nombre completo del usuario |
| `fechaNacimientoUsuario` | `string` con formato fecha ISO (`@IsDateString`) | Ej. `"2000-08-18"` |
| `generoUsuario` | `number`, no vacío | Código numérico de género (catálogo propio del frontend) |
| `telefonoUsuario` | `string`, no vacío | |
| `correoUsuario` | `string`, formato email (`@IsEmail`) | **Único** — es el identificador de login. Si ya existe, el backend responde `406 Not Acceptable` ("El usuario ya existe") |
| `claveAcceso` | `string`, no vacío | Se guarda cifrada con `bcryptjs` (`hashSync`, 10 rondas). El frontend debe aplicar sus propias reglas de fortaleza antes de enviarla |

> ⚠️ **No** se envía `nombreAcceso` — ese campo fue eliminado (era redundante con `nombreUsuario`). El login es por `correoUsuario`, no por un "nombre de acceso" separado.

### Respuesta exitosa (200)

```json
{
  "mensaje": "Usuario registrado correctamente",
  "tokenApp": "<jwt firmado>"
}
```

El registro **deja la sesión iniciada**: devuelve un `tokenApp` listo para usar, igual que el login. No hace falta loguear de nuevo justo después de registrarse.

### Errores posibles

| Status | Mensaje | Causa |
|---|---|---|
| `406 Not Acceptable` | `El usuario ya existe` | Ya hay un `Usuario`/`Acceso` con ese `correoUsuario` |
| `409 Conflict` | `El rol de clientes no está configurado` | Falla de configuración del backend (rol `clientes` no sembrado) — no es un error del cliente |
| `409 Conflict` | `Fallo al registrar el usuario` | Error inesperado durante la transacción (se hace rollback completo: no queda `Usuario` huérfano sin `Acceso`) |
| `400 Bad Request` | Errores de validación de `class-validator` | Campos faltantes/con formato inválido (p. ej. `correoUsuario` no es un email) |

---

## 2. Inicio de sesión — `POST /publico/accesos/signin`

### Body (`LoginDto`)

```json
{
  "correoUsuario": "andres@example.com",
  "claveAcceso": "Keillter@30"
}
```

| Campo | Tipo / validación |
|---|---|
| `correoUsuario` | `string`, formato email (`@IsEmail`) |
| `claveAcceso` | `string`, no vacío (texto plano — el backend la compara contra el hash con `bcryptjs.compareSync`) |

### Respuesta exitosa (200)

```json
{
  "mensaje": "Inicio de sesión exitoso",
  "tokenApp": "<jwt firmado>"
}
```

### Errores posibles

| Status | Mensaje | Causa |
|---|---|---|
| `400 Bad Request` | `Usuario no registrado` | No existe ningún `Usuario` con ese `correoUsuario` (o no tiene `Acceso` asociado) |
| `401 Unauthorized` | `Las claves no coinciden` | El correo existe pero la contraseña no coincide |
| `409 Conflict` | `Fallo al consultar la información` / `Fallo al generar la autenticación` | Error inesperado al construir la sesión/token |

---

## 3. El token (`tokenApp`)

Tanto registro como login devuelven un **JWT** generado por `GenerarToken.procesarRespuesta` (`src/utilities/shared/generarToken.ts`), firmado con `JWT_SECRET` y expiración `JWT_EXPIRES_IN` (por defecto `8h`).

### Payload del token

```json
{
  "id": 12,
  "nombre": "Andres Pérez",
  "rol": "clientes",
  "telefono": "3007538453",
  "correo": "andres@example.com"
}
```

| Claim | Origen |
|---|---|
| `id` | `cod_usuario` |
| `nombre` | `nombre_usuario` |
| `rol` | `nombre_rol` (tabla `roles`, vía `cod_rol` del usuario) |
| `telefono` | `telefono_usuario` |
| `correo` | `correo_usuario` |

> Nota: ya **no** existe el claim `access` (antes traía `nombre_acceso`). Si el frontend lo leía para mostrar algo, debe migrar a `correo`.

### Cómo usarlo

Guarda `tokenApp` (p. ej. en almacenamiento seguro / cookie httpOnly según la plataforma) y envíalo en cada petición a rutas privadas:

```
Authorization: Bearer <tokenApp>
```

`AuthGuard` lo valida y `RolesGuard` decide el acceso según el claim `rol` y los `@Roles(...)` del endpoint (ver [SKILL.md](SKILL.md) para el detalle de permisos por módulo/rol).

---

## 4. Flujo recomendado en el frontend

1. **Registro**: `POST /publico/registros/user` → guardar `tokenApp` → usuario queda autenticado como `clientes` de inmediato (no hace falta loguear aparte).
2. **Login**: `POST /publico/accesos/signin` → guardar `tokenApp`.
3. En cada arranque de la app, si hay `tokenApp` guardado, úsalo directo en `Authorization: Bearer ...`; si una petición responde `401`, el token expiró o es inválido → redirigir a login.
4. Para mostrar datos del usuario logueado sin decodificar el JWT en el cliente, usa `GET /usuarios/perfil` (protegido, cualquier rol autenticado) en vez de confiar en el contenido del token.

## 5. Cosas que el frontend NO debe hacer

- No enviar `nombreAcceso`/`codRol` en el registro — el backend los ignora o rechaza; el rol siempre se asigna como `clientes` en `/publico/registros/user`.
- No asumir que el login acepta un "nombre de usuario" — solo acepta `correoUsuario` (formato email).
- No decodificar el JWT para decidir permisos de UI de forma definitiva — son una guía de UX; la autorización real la hace siempre el backend (`AuthGuard`/`RolesGuard`).
