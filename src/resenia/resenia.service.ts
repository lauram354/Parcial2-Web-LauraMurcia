import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

@Injectable()
export class ReseniaService {
    constructor(
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>,

        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>,

        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>

    ){}

    async agregarResenia(resenia: ReseniaEntity): Promise<ReseniaEntity> {
        const estudiante = await this.estudianteRepository.findOne({where:{id: resenia.estudiante.id}, relations:["actividades"]});
         if (!estudiante)
             throw new BusinessLogicException("estudiante no existe", BusinessError.NOT_FOUND);
        
         const actividad = await this.actividadRepository.findOne({where:{id: resenia.actividad.id}});
         if (!actividad)
             throw new BusinessLogicException("actividad no existe", BusinessError.NOT_FOUND);

         if (!estudiante.actividades.some(act => act.id === actividad.id))
             throw new BusinessLogicException("estudiante no estuvo inscrito", BusinessError.PRECONDITION_FAILED);

         if (actividad.estado !== 2)
             throw new BusinessLogicException("actividad no finalizada", BusinessError.PRECONDITION_FAILED);

        return await this.reseniaRepository.save(resenia);
     }


}
