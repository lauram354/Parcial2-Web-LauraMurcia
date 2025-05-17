import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';


@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>,

        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>


    ){}



    async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(estudiante.correo))
            throw new BusinessLogicException("El correo no es valido", BusinessError.PRECONDITION_FAILED);
            
        if (estudiante.semestre > 10 || estudiante.semestre < 1)
            throw new BusinessLogicException("El semestre debe ser de 1 a 10", BusinessError.PRECONDITION_FAILED);
        
        return await this.estudianteRepository.save(estudiante);
   }

    async findEstudianteById(id: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({where: {id}, relations: ["actividades","resenias"] } );
    if (!estudiante)
        throw new BusinessLogicException("estudiante no encontrado", BusinessError.NOT_FOUND);

    return estudiante;
    }

    async inscribirseActividad(estudianteId: number, actividadId: number): Promise<EstudianteEntity> {
       const actividad = await this.actividadRepository.findOne({where: {id: actividadId}, relations: ["estudiantes"],});
       if (!actividad)
         throw new BusinessLogicException("The actividad with the given id was not found", BusinessError.NOT_FOUND);
     
       const estudiante = await this.estudianteRepository.findOne({where: {id: estudianteId}, relations: ["actividades", "resenias"]})
       if (!estudiante)
         throw new BusinessLogicException("The student with the given id was not found", BusinessError.NOT_FOUND);
   
       if (0.8*(actividad.cupo) <  actividad.estudiantes.length + 1)
            throw new BusinessLogicException("No hay cupo", BusinessError.PRECONDITION_FAILED);

       if (actividad.estado !== 0 )
            throw new BusinessLogicException("No es valido el estado", BusinessError.PRECONDITION_FAILED);

       if (estudiante.actividades.some(a => a.id === actividad.id))
            throw new BusinessLogicException("Hay una inscripcion previa", BusinessError.PRECONDITION_FAILED);

       estudiante.actividades = [...estudiante.actividades, actividad];
       return await this.estudianteRepository.save(estudiante);
     }


}
