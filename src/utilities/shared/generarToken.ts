import { sign } from "jsonwebtoken";

class GenerarToken{
    public static procesarRespuesta(datosSesion: any): string{
        let token: string="";
        console.log(datosSesion);
        
        token = sign({
            id:datosSesion.cod_usuario,
            nombre: datosSesion.nombre_usuario,
            rol: datosSesion.nombre_rol,
            telefono: datosSesion.telefono_usuario,
            correo: datosSesion.correo_usuario

        }, process.env.JWT_SECRET ?? "laClaveSecreta", { expiresIn: (process.env.JWT_EXPIRES_IN ?? "8h") as any });
    
        return token;

    }
}

export default GenerarToken;