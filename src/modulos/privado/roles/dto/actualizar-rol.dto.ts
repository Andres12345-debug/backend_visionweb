import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class ActualizarRolDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreRol?: string;

  @IsOptional()
  @IsNumber()
  estadoRol?: number;
}
