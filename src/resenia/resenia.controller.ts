import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ReseniaService } from './resenia.service';
import { ReseniaDto } from './resenia.dto/resenia.dto';
import { ReseniaEntity } from './resenia.entity/resenia.entity';


@Controller('resenia')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaController {
    constructor(private readonly reseniaService: ReseniaService){}

    @Post()
    async agregarResenia(@Body() reseniaDto: ReseniaDto) {
    const resenia = plainToInstance(ReseniaEntity, reseniaDto);
    return await this.reseniaService.agregarResenia(resenia);
    }


}


