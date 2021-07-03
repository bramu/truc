import { IsEmail, IsString } from "class-validator";

export class SignUpDto {
  @IsString() 
  readonly password: string;

  @IsEmail()
  readonly email: number;

  @IsString()
  readonly account: string;
}

export class ChangePasswordDto {
  @IsEmail()
  email: number;
}