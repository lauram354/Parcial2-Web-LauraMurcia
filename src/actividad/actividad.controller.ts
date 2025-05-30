import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './actividad.dto/actividad.dto';
import { ActividadEntity } from './actividad.entity/actividad.entity';


@Controller('actividad')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
    constructor(private readonly actividadService: ActividadService){}

    @Post()
    async crearActividad(@Body() actividadDto: ActividadDto) {
    const actividad = plainToInstance(ActividadEntity, actividadDto);
    return await this.actividadService.crearActividad(actividad);
    }

    @Put(':actividadId/:estado')
    async cambiarEstado(@Param('actividadId') actividadId: number, @Param('estado') estado: number) {
        return await this.actividadService.cambiarEstado(actividadId, estado);
    }

    @Get()
    async findAllActividadesByDate(@Body('fecha') fecha: string){
    return await this.actividadService.findAllActividadesByDate(fecha);
    }



}


