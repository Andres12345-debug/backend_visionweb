import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class RegistroDto {

  // Usuario
  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaNacimientoUsuario!: string;

  @IsNumber()
  @IsNotEmpty()
  generoUsuario!: number;

  @IsString()
  @IsNotEmpty()
  telefonoUsuario!: string;

  @IsEmail()
  @IsNotEmpty()
  correoUsuario!: string;

  @IsNumber()
  @IsNotEmpty()
  codRol!: number;

  // Acceso
  @IsString()
  @IsNotEmpty()
  nombreAcceso!: string;

  @IsString()
  @IsNotEmpty()
  claveAcceso!: string;
}