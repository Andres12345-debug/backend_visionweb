import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../usuario/usuario";
import { Servicios } from "../servicios/servicios";

@Entity("cliente_servicios", { schema: "public" })
export class ClienteServicios {
    @PrimaryGeneratedColumn({ type: "integer", name: "cod_cliente_servicio" })
    public codClienteServicio!: number;

    @Column({ type: "integer", nullable: false, name: "cod_usuario" })
    public codUsuario!: number;

    @Column({ type: "integer", nullable: false, name: "cod_servicio" })
    public codServicio!: number;

    @Column({ type: "date", nullable: false, name: "fecha_inicio" })
    public fechaInicio!: Date;

    @Column({ type: "date", nullable: true, name: "fecha_fin" })
    public fechaFin!: Date;

    @Column({ type: "numeric", precision: 12, scale: 2, nullable: false, name: "precio_pactado" })
    public precioPactado!: number;

    @Column({ type: "varchar", length: 100, nullable: false, name: "estado" })
    public estado!: string;

    @Column({ type: "varchar", length: 500, nullable: true, name: "url_contrato" })
    public urlContrato!: string;

    @Column({ type: "varchar", length: 500, nullable: true, name: "observaciones" })
    public observaciones!: string;

    @CreateDateColumn({ name: "created_at" })
    public createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt!: Date;

    // Relación con Usuario (el cliente es un usuario con rol "clientes")
    @ManyToOne(() => Usuario, (objUsuario) => objUsuario.clienteServicios, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: "cod_usuario", referencedColumnName: "codUsuario" })
    public usuario?: Usuario;

    // Relación con Servicios
    @ManyToOne(() => Servicios, (objServicio) => objServicio.clienteServicios, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: "cod_servicio", referencedColumnName: "codServicio" })
    public servicio?: Servicios;
}
