import { Type } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsString, ValidateNested} from 'class-validator';

class EstudianteIdDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

class ActividadIdDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class ReseniaDto {


 @IsString()
 @IsNotEmpty()
 readonly comentario: string;

 @IsNumber()
 @IsNotEmpty()
 readonly calificacion: number;
  
 @IsString()
 @IsNotEmpty()
 readonly fecha: string;

 
  @ValidateNested()
  @Type(() => EstudianteIdDto)
  @IsNotEmpty()
  readonly estudiante: EstudianteIdDto;

  @ValidateNested()
  @Type(() => ActividadIdDto)
  @IsNotEmpty()
  readonly actividad: ActividadIdDto;

}