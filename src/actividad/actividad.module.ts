import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadController } from './actividad.controller';
import { ActividadEntity } from './actividad.entity/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  providers: [ActividadService],
  controllers: [ActividadController]
})
export class ActividadModule {}
