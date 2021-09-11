import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly account: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'User password' })
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
}

export class PwdResetLinkDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly pwdResetToken: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly appId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly confirmPassword: string;
}
