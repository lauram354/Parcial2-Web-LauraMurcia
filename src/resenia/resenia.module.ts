import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseniaController } from './resenia.controller';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReseniaEntity, EstudianteEntity, ActividadEntity])],
  providers: [ReseniaService],
  controllers: [ReseniaController]
})
export class ReseniaModule {}
