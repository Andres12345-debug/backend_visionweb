import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ActualizarServicioDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreServicio?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcionServicio?: string;

  @IsOptional()
  @IsNumber()
  precioBaseServicio?: number;
}
