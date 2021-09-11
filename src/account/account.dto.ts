import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
export class InvitationDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly emails: Array<[]>;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly appId: string; // App Id is account Id
}

export class DiscardInviteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly appId: string; // App Id is account Id
}
