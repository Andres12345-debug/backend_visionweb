import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('correos')
export class Correos {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  mensaje: string;

  @CreateDateColumn()
  fecha: Date;

  // 🔹 NUEVO
  @Column({ default: false })
  respondido: boolean;

  // 🔹 NUEVO
  @Column({ type: 'timestamp', nullable: true })
  fechaRespuesta: Date;

}