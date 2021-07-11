import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly account: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class PwdResetLinkDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly pwdResetToken: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly appId: string;

  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
