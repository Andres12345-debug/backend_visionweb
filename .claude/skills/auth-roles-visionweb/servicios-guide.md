# Guía de Servicios y Contratos de Cliente para frontend

Referencia de los endpoints privados de **catálogo de servicios** (`servicios`) y **contratación de servicios por cliente** (`cliente-servicios`), pensada para quien construye el cliente (web/móvil). Basada en `src/modulos/privado/servicios` y `src/modulos/privado/cliente_servicios`.

Ambos cuelgan del prefijo `privado` (ver `privado.module.ts` → `RouterModule.register`) y **requieren** `Authorization: Bearer <tokenApp>` (`AuthGuard` + `RolesGuard` en todo el controlador):

- `servicios` → `{{base_url}}/privado/servicios/...`
- `cliente-servicios` → `{{base_url}}/privado/cliente-servicios/...`

---

## 1. Servicios (catálogo) — `/privado/servicios`

Es el catálogo de servicios que ofrece VisionWeb (nombre, descripción, precio base). Lo gestionan administradores y supervisores; **eliminar** es exclusivo de administradores.

| Acción | Método y ruta | Roles permitidos |
|---|---|---|
| Listar todos | `GET /privado/servicios/todos` | `administradores`, `supervisores` |
| Ver uno | `GET /privado/servicios/:id` | `administradores`, `supervisores` |
| Crear | `POST /privado/servicios/agregar` | `administradores`, `supervisores` |
| Actualizar | `PUT /privado/servicios/actualizar/:id` | `administradores`, `supervisores` |
| Eliminar | `DELETE /privado/servicios/delete/:id` | `administradores` |

### Entidad `Servicios` (forma de los objetos que recibe el frontend)

```json
{
  "codServicio": 1,
  "nombreServicio": "Mantenimiento de equipos",
  "descripcionServicio": "Revisión y mantenimiento preventivo mensual",
  "precioBaseServicio": "350000.00"
}
```

> `precioBaseServicio` es `numeric(12,2)` en la base de datos — TypeORM/PG lo devuelve como **string** (`"350000.00"`), no como `number`. Conviértelo con `Number(...)` o `parseFloat(...)` antes de operar con él en el frontend.

### Crear — `POST /privado/servicios/agregar` (`CrearServicioDto`)

```json
{
  "nombreServicio": "Mantenimiento de equipos",
  "descripcionServicio": "Revisión y mantenimiento preventivo mensual",
  "precioBaseServicio": 350000
}
```

| Campo | Tipo / validación | Notas |
|---|---|---|
| `nombreServicio` | `string`, no vacío | **Único** — si ya existe un servicio con ese nombre, el backend responde `409 Conflict` ("El servicio ya existe") |
| `descripcionServicio` | `string`, opcional | |
| `precioBaseServicio` | `number`, no vacío | Precio de lista/base del servicio |

Respuesta exitosa:

```json
{
  "mensaje": "Servicio registrado correctamente",
  "servicio": { "codServicio": 5, "nombreServicio": "...", "descripcionServicio": "...", "precioBaseServicio": "350000.00" }
}
```

### Actualizar — `PUT /privado/servicios/actualizar/:id` (`ActualizarServicioDto`)

Mismos campos que `CrearServicioDto` pero **todos opcionales** — envía solo lo que cambia (update parcial):

```json
{ "precioBaseServicio": 380000 }
```

Respuesta: `{ "mensaje": "Servicio actualizado correctamente" }`

### Eliminar — `DELETE /privado/servicios/delete/:id`

Solo `administradores`. Respuesta: `{ "mensaje": "Servicio eliminado correctamente" }`.

> ⚠️ La relación `cliente_servicios → servicios` tiene `onDelete: 'RESTRICT'`: si el servicio tiene contratos asociados, la base de datos rechazará el `DELETE`. El frontend debería anticipar/mostrar ese caso (verifica primero si hay `cliente-servicios` activos para ese `codServicio`).

### Errores posibles

| Status | Mensaje | Causa |
|---|---|---|
| `404 Not Found` | `Servicio no encontrado` | `:id` no existe (en `consultarUno`, `actualizar`, `eliminar`) |
| `409 Conflict` | `El servicio ya existe` | `nombreServicio` duplicado al crear |
| `400 Bad Request` | Errores de `class-validator` | Campos faltantes/con formato inválido |

---

## 2. Cliente-Servicios (contratos) — `/privado/cliente-servicios`

Representa la **contratación de un servicio por parte de un cliente** (un `Usuario` con rol `clientes`): qué servicio, desde cuándo, hasta cuándo, a qué precio pactado y en qué estado. Es el equivalente a un "contrato" o "suscripción".

| Acción | Método y ruta | Roles permitidos |
|---|---|---|
| Listar todos | `GET /privado/cliente-servicios/todos` | `administradores`, `supervisores` |
| **Mis contratos activos** | `GET /privado/cliente-servicios/mios` | `clientes` (autenticado, ve solo los suyos) |
| Ver uno | `GET /privado/cliente-servicios/:id` | `administradores`, `supervisores` |
| Crear / asignar | `POST /privado/cliente-servicios/agregar` | `administradores`, `supervisores` |
| Actualizar | `PUT /privado/cliente-servicios/actualizar/:id` | `administradores`, `supervisores` |
| Eliminar | `DELETE /privado/cliente-servicios/delete/:id` | `administradores` |

> A diferencia de `servicios` (que exige rol en toda la clase), aquí cada endpoint declara su propio `@Roles(...)` — incluyendo `/mios`, pensado para que el **propio cliente** consulte sus contratos desde su panel, sin ver los de otros usuarios.

### Entidad `ClienteServicios` (forma de los objetos que recibe el frontend)

`listar`, `consultarUno` y `mios` devuelven el contrato con sus relaciones `usuario` y `servicio` ya cargadas (`relations: ['usuario', 'servicio']`):

```json
{
  "codClienteServicio": 10,
  "codUsuario": 7,
  "codServicio": 1,
  "fechaInicio": "2026-01-15",
  "fechaFin": null,
  "precioPactado": "300000.00",
  "estado": "activo",
  "urlContrato": "https://.../contrato-10.pdf",
  "observaciones": "Plan anual con descuento",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T10:00:00.000Z",
  "usuario": { "codUsuario": 7, "nombreUsuario": "Andres", "correoUsuario": "andres@example.com", "...": "..." },
  "servicio": { "codServicio": 1, "nombreServicio": "Mantenimiento de equipos", "precioBaseServicio": "350000.00", "...": "..." }
}
```

> Igual que en `servicios`, `precioPactado` (y `precioBaseServicio` dentro de `servicio`) llegan como **string** numérico (`numeric(12,2)`) — convierte antes de hacer cálculos.

### `GET /privado/cliente-servicios/mios` — panel del cliente

Pensado para que un usuario autenticado con rol `clientes` vea **sus propios** contratos en estado `activo` (filtro `estado ILIKE 'activo'`, sin distinguir mayúsculas/minúsculas), ordenados por `fechaInicio` descendente. No requiere `:id` ni parámetros — el backend identifica al usuario por el JWT (`@UsuarioActual()` → `usuario.id`).

```http
GET {{base_url}}/privado/cliente-servicios/mios
Authorization: Bearer <token-del-cliente>
```

Devuelve un arreglo (puede ser vacío `[]` si no tiene contratos activos), con la misma forma que el objeto de arriba.

### Crear / asignar — `POST /privado/cliente-servicios/agregar` (`CrearClienteServicioDto`)

```json
{
  "codUsuario": 7,
  "codServicio": 1,
  "fechaInicio": "2026-01-15",
  "fechaFin": "2026-12-15",
  "precioPactado": 300000,
  "estado": "activo",
  "urlContrato": "https://.../contrato-10.pdf",
  "observaciones": "Plan anual con descuento"
}
```

| Campo | Tipo / validación | Notas |
|---|---|---|
| `codUsuario` | `number`, no vacío | Debe existir un `Usuario` con ese código — si no, `404 Not Found` ("El usuario indicado no existe") |
| `codServicio` | `number`, no vacío | Código del servicio del catálogo (`Servicios.codServicio`) — el backend **no valida aquí** que el servicio exista; un `codServicio` inválido fallará a nivel de base de datos por la FK |
| `fechaInicio` | `string`, fecha ISO (`@IsDateString`) | Ej. `"2026-01-15"` |
| `fechaFin` | `string`, fecha ISO, opcional | Omite o envía `null` para contratos sin fecha de fin definida |
| `precioPactado` | `number`, no vacío | Precio acordado con el cliente (puede diferir del `precioBaseServicio` del catálogo) |
| `estado` | `string`, no vacío | Texto libre del backend (p. ej. `"activo"`, `"pausado"`, `"finalizado"`, `"cancelado"`) — el frontend debe estandarizar/validar los valores que ofrece, ya que no hay un enum en el backend |
| `urlContrato` | `string`, opcional | Link al PDF/documento del contrato (subido por fuera de este endpoint) |
| `observaciones` | `string`, opcional | Notas internas |

Respuesta exitosa:

```json
{
  "mensaje": "Servicio asignado al cliente correctamente",
  "clienteServicio": { "codClienteServicio": 10, "codUsuario": 7, "...": "..." }
}
```

> El objeto `clienteServicio` de la respuesta de creación **no** trae las relaciones `usuario`/`servicio` cargadas (a diferencia de `listar`/`consultarUno`/`mios`) — solo los campos planos de la tabla. Si necesitas mostrar nombre del cliente o del servicio justo después de crear, pide el registro de nuevo con `GET /:id`.

### Actualizar — `PUT /privado/cliente-servicios/actualizar/:id` (`ActualizarClienteServicioDto`)

Mismos campos que `CrearClienteServicioDto` pero **todos opcionales** — útil para cambiar solo el `estado` (renovar, pausar, cancelar) o ajustar fechas/precio:

```json
{ "estado": "finalizado", "fechaFin": "2026-06-01" }
```

Respuesta: `{ "mensaje": "Servicio de cliente actualizado correctamente" }`

### Eliminar — `DELETE /privado/cliente-servicios/delete/:id`

Solo `administradores`. Respuesta: `{ "mensaje": "Servicio de cliente eliminado correctamente" }`.

### Errores posibles

| Status | Mensaje | Causa |
|---|---|---|
| `404 Not Found` | `Servicio de cliente no encontrado` | `:id` no existe (en `consultarUno`, `actualizar`, `eliminar`) |
| `404 Not Found` | `El usuario indicado no existe` | `codUsuario` no corresponde a ningún `Usuario` al crear |
| `400 Bad Request` | Errores de `class-validator` | Campos faltantes/con formato inválido (p. ej. `fechaInicio` no es fecha ISO) |
| `403 Forbidden` | — | Token válido pero rol sin permiso para el endpoint (p. ej. un `clientes` intentando `GET /todos`) |

---

## Resumen de prefijos y autenticación

- Prefijo común: `{{base_url}}/privado/...` (a diferencia de `correos/contacto` o `registros/user`, **no** son rutas públicas).
- Header obligatorio en ambos módulos: `Authorization: Bearer <tokenApp>` (el mismo `tokenApp` que devuelve login/registro — ver [frontend-auth-guide.md](frontend-auth-guide.md)).
- Si el token falta o es inválido: `401 Unauthorized`. Si el token es válido pero el rol no tiene permiso para ese endpoint: `403 Forbidden`.
- El claim `rol` del JWT se fija al momento del login — si a un usuario le cambian el rol o se le asigna un contrato nuevo, debe **volver a iniciar sesión** para que su token (y, en el caso de `clientes`, su vista `/cliente-servicios/mios`) refleje el estado vigente.
