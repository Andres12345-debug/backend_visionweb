import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsNotEmpty()
  public nombreAcceso!: string;

  @IsString()
  @IsNotEmpty()
  public claveAcceso!: string;
}