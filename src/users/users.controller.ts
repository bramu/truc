import { Body, Controller, HttpStatus, Post, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ChangePasswordDto, SignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  signIn(): void {}

  @Post('signup')
  signUp(@Body(new ValidationPipe()) signupDto: SignUpDto, @Res() res: Response): void{
    res.json({"dfds": "dsfdsfds"});
  }

  @Post('change_password')
  changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): void {}

  @Post('reset_password')
  resetPassword(): void {}
}
