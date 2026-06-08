import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClienteServicios } from "../cliente_servicios/cliente_servicios";

@Entity("servicios", { schema: "public" })
export class Servicios {
    @PrimaryGeneratedColumn({ type: "integer", name: "cod_servicio" })
    public codServicio!: number;

    @Column({ type: "varchar", length: 250, nullable: false, name: "nombre_servicio" })
    public nombreServicio!: string;

    @Column({ type: "varchar", length: 500, nullable: true, name: "descripcion_servicio" })
    public descripcionServicio!: string;

    @Column({ type: "numeric", precision: 12, scale: 2, nullable: false, name: "precio_base_servicio" })
    public precioBaseServicio!: number;

    @OneToMany(() => ClienteServicios, (objClienteServicio) => objClienteServicio.servicio)
    public clienteServicios?: ClienteServicios[];
}
