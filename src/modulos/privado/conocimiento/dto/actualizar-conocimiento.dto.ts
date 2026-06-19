import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarConocimientoDto {

  @IsOptional()
  @IsString()
  @MaxLength(150)
  titulo?: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
