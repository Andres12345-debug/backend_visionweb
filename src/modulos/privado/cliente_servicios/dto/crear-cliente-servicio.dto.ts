import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CrearClienteServicioDto {

  @IsNumber()
  @IsNotEmpty()
  codUsuario!: number;

  @IsNumber()
  @IsNotEmpty()
  codServicio!: number;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsNumber()
  @IsNotEmpty()
  precioPactado!: number;

  @IsString()
  @IsNotEmpty()
  estado!: string;

  @IsOptional()
  @IsString()
  urlContrato?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
