import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
export class InvitationDto {
  @IsArray()
  @IsNotEmpty()
  readonly emails: Array<[]>;

  @IsString()
  @IsNotEmpty()
  readonly appId: string; // App Id is account Id
}

export class DiscardInviteDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly appId: string; // App Id is account Id
}
