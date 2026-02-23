import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ContactoDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  mensaje: string;
}