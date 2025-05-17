import {IsNotEmpty, IsNumber, IsString, IsEmail} from 'class-validator';
export class EstudianteDto {

 @IsNumber()
 @IsNotEmpty()
 readonly cedula: number;
 
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsEmail()
 @IsNotEmpty()
 readonly correo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly programa: string;

 @IsNumber()
 @IsNotEmpty()
 readonly semestre: number;

}