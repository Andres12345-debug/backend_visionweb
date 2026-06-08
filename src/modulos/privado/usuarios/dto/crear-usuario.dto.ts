import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  empresaUsuario?: string;
}