import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("clientes", { schema: "public" })
export class Clientes {
    @PrimaryGeneratedColumn({ type: "integer", name: "cod_cliente" })
    public codCliente!: number;
    @Column({ type: "varchar", length: 250, nullable: false, name: "nombre_cliente" })
    public nombreCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "apellido_cliente" })
    public apellidoCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: false, name: "nit_Cliente" })
    public nitCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "direccion_cliente" })
    public direccionCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "correo_cliente" })
    public correoCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: false, name: "telefono_cliente" })
    public telefonoCliente!: string;  
    @Column({ type: "varchar", length: 250, nullable: true, name: "telefono_secundario_cliente" })
    public telefonoSecundarioCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "pais_cliente" })
    public paisCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "estado_cliente" })
    public estadoCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "ciudad_cliente" })
    public ciudadCliente!: string;
    @Column({ type: "varchar", length: 250, nullable: true, name: "empresa_cliente" })
    public empresaCliente!: string;
    @Column({ type: "varchar", length: 500, nullable: true, name: "caracteristica_cliente" })
    public caracteristicaCliente!: string;
    
}
