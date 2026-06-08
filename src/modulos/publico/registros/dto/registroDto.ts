import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsDateString,
  IsOptional,
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  empresaUsuario?: string;

  @IsEmail()
  @IsNotEmpty()
  correoUsuario!: string;

  // Acceso
  @IsString()
  @IsNotEmpty()
  claveAcceso!: string;
}