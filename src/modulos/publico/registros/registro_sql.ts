export const ACCESO_SQL = {
    DATOS_SESION: `SELECT u.cod_usuario, u.nombre_usuario, u.telefono_usuario, u.correo_usuario, \
    (SELECT nombre_rol FROM roles WHERE cod_rol=u.cod_rol) AS nombre_rol \
    FROM usuarios u \
    WHERE u.cod_usuario = $1`
};
