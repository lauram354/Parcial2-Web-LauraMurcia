import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity/actividad.entity';
import { EstudianteController } from './estudiante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  providers: [EstudianteService],
  controllers: [EstudianteController]
})
export class EstudianteModule {}
