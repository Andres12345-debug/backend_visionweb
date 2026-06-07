import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ActualizarClienteDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellidoCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nitCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  direccionCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  correoCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefonoCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefonoSecundarioCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estadoCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ciudadCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  empresaCliente?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  caracteristicaCliente?: string;

  @IsOptional()
  @IsNumber()
  generoUsuario?: number;
}
