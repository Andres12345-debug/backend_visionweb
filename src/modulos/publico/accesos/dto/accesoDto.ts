import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  public correoUsuario!: string;

  @IsString()
  @IsNotEmpty()
  public claveAcceso!: string;
}