import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseniaController } from './resenia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReseniaEntity, EstudianteEntity, ActividadEntity])],
  providers: [ReseniaService],
  controllers: [ReseniaController]
})
export class ReseniaModule {}
