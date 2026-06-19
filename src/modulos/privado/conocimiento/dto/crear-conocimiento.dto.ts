import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearConocimientoDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  contenido!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
