import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Acceso } from "../acceso/acceso";
import { Rol } from "../rol/rol";
import { ClienteServicios } from "../cliente_servicios/cliente_servicios";

@Entity("usuarios", { schema: "public" })
export class Usuario {
    @PrimaryGeneratedColumn({ type: "integer", name: "cod_usuario" })
    public codUsuario!: number;
    @Column({ type: "integer", nullable: false, name: "cod_rol" })
    public codRol!: number;
    @Column({ type: "varchar", length: 250, nullable: false, name: "nombre_usuario" })
    public nombreUsuario!: string;
    @Column({ type: "varchar", length: 250, nullable: false, unique: true, name: "correo_usuario" })
    public correoUsuario!: string;
    @Column({ type: "date", nullable: false, name: "fecha_nacimiento_usuario" })
    public fechaNacimientoUsuario!: Date;
    @Column({ type: "varchar", length: 250, nullable: false, name: "telefono_usuario" })
    public telefonoUsuario!: string;
    @Column({ type: "integer", nullable: false, name: "genero_usuario" })
    public generoUsuario!: number;
    @Column({ type: "varchar", length: 250, nullable: true, name: "empresa_usuario" })
    public empresaUsuario!: string;

    // Relación con Acceso
    @OneToOne(() => Acceso, (objAcceso) => objAcceso.usuario)
    public acceso?: Acceso;


    //Relacion con Roles mando
    @ManyToOne(() => Rol, (objRol: Rol) => objRol.usuarios, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: "cod_rol", referencedColumnName: "codRol" })
    public codRolU?: Rol;

    // Relación con ClienteServicios (contratos de servicios cuando el usuario tiene rol "clientes")
    @OneToMany(() => ClienteServicios, (objClienteServicio) => objClienteServicio.usuario)
    public clienteServicios?: ClienteServicios[];

}
