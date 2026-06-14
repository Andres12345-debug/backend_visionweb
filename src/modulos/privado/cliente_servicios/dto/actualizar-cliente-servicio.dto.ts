import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class ActualizarClienteServicioDto {

  @IsOptional()
  @IsNumber()
  codUsuario?: number;

  @IsOptional()
  @IsNumber()
  codServicio?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsNumber()
  precioPactado?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estado?: string;

  @IsOptional()
  @IsString()
  urlContrato?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
