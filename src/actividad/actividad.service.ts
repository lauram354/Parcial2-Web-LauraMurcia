import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { ActividadEntity } from './actividad.entity/actividad.entity';

@Injectable()
export class ActividadService {
    constructor(
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>,
        

    ){}



    async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
        const pattern =  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (pattern.test(actividad.titulo))
            throw new BusinessLogicException("El titulo tiene caracteres especiales", BusinessError.PRECONDITION_FAILED);
            
        if (actividad.titulo.length < 15)
            throw new BusinessLogicException("El titulo debe tener 15 caracteres", BusinessError.PRECONDITION_FAILED);
        
        return await this.actividadRepository.save(actividad);
   }

   async cambiarEstado(id: number, estado: number): Promise<ActividadEntity> {
        const persistedActividad = await this.actividadRepository.findOne({where:{id}});
        if (!persistedActividad)
          throw new BusinessLogicException("No se encontró la actividad", BusinessError.NOT_FOUND);

        persistedActividad.estado = estado
        
        return await this.actividadRepository.save({...persistedActividad});
    }

    async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
        return await this.actividadRepository.find({where: {fecha: fecha}, relations: ["estudiantes", "resenias"] } );
   }



}
