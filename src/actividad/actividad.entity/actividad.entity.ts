import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ReseniaEntity } from '../../resenia/resenia.entity/resenia.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActividadEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 titulo: string;
 
 @Column()
 fecha: string;
 
 @Column()
 cupo: number;
 
 @Column()
 estado: number;

 @OneToMany(() => ReseniaEntity, resenia => resenia.actividad)
    resenias: ReseniaEntity[];

 @ManyToMany(() => EstudianteEntity, estudiante => estudiante.actividades)
    estudiantes: EstudianteEntity[];
}