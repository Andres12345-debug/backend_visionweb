import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CrearUsuarioDto {

  @IsNumber()
  codRol!: number;

  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;

  @IsDateString()
  fechaNacimientoUsuario!: string;

  @IsString()
  @IsNotEmpty()
  telefonoUsuario!: string;

  @IsNumber()
  generoUsuario!: number;
}