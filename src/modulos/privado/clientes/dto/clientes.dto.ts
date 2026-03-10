import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CrearClienteDto {

  @IsString()
  @IsNotEmpty()
  nombreCliente!: string;
  @IsString()
  @IsNotEmpty()
  apellidoCliente!: string;
  @IsString()
  @IsNotEmpty()
  nitCliente!: string;
  @IsString()
  @IsNotEmpty()
  direccionCliente!: string;
  @IsString()
  @IsNotEmpty()
  correoCliente!: string;
  @IsString()
  @IsNotEmpty()
  telefonoCliente!: string;
  @IsString()
  @IsNotEmpty()
  telefonoSecundarioCliente!: string;
  @IsString()
  @IsNotEmpty()
  estadoCliente!: string;
  @IsString()
  @IsNotEmpty()
  ciudadCliente!: string;
  @IsString()
  @IsNotEmpty()
  empresaCliente!: string;
  @IsString()
  @IsNotEmpty()
  caracteristicaCliente!: string;

  @IsNumber()
  generoUsuario!: number;
}