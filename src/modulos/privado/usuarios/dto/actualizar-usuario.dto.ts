import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class ActualizarUsuarioDto {

  @IsOptional()
  @IsNumber()
  codRol?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreUsuario?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimientoUsuario?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefonoUsuario?: string;

  @IsOptional()
  @IsNumber()
  generoUsuario?: number;

  @IsOptional()
  @IsString()
  empresaUsuario?: string;
}
