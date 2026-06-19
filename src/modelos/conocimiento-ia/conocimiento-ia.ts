import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conocimiento_ia')
export class ConocimientoIA {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  titulo!: string;

  @Column({ type: 'text' })
  contenido!: string;

  @Column({ length: 50, nullable: true })
  categoria!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fecha!: Date;

}
