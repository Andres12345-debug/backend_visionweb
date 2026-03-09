import { IsEmail, IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';

export class ResponderCorreoDto {

  @IsNumber()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  asunto: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  mensaje: string;

}