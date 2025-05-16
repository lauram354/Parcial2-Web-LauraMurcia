import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseniaEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 comentario: string;
 
 @Column()
 calificacion: number;
 
 @Column()
 fecha: string;

 @ManyToOne(() => EstudianteEntity, estudiante => estudiante.resenias)
    estudiante: EstudianteEntity;

 @ManyToOne(() => ActividadEntity, actividad => actividad.resenias)
    actividad: ActividadEntity;

}