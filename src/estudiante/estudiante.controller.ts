import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { plainToInstance } from 'class-transformer';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';


@Controller('estudiante')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService){}

    @Post()
    async crearEstudiante(@Body() estudianteDto: EstudianteDto) {
    const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
    return await this.estudianteService.crearEstudiante(estudiante);
    }

    @Get(':estudianteId')
    async findEstudianteById(@Param('estudianteId') id: number){
       return await this.estudianteService.findEstudianteById(id);
    }

    @Post(':estudianteId/actividades/:actividadId')
   async inscribirseActividad(@Param('estudianteId') estudianteId: number, @Param('actividadId') actividadId: number){
       return await this.estudianteService.inscribirseActividad(estudianteId, actividadId);
   }


}


