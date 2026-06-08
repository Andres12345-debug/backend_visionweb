import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CrearServicioDto {

  @IsString()
  @IsNotEmpty()
  nombreServicio!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcionServicio?: string;

  @IsNumber()
  @IsNotEmpty()
  precioBaseServicio!: number;
}
