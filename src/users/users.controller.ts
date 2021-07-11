import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<any> {
    return res.status(200).json({ dfds: 'dsfdsfds' });
  }

  @Post('signup')
  async signUp(
    @Body(new ValidationPipe()) signupDto: SignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    // create the user first and then sign in
    const ret = await this.userService.createUser(signupDto);
    if (null == ret || null == ret.user) {
      return res.status(400).json(ret);
    }

    // once the user creates successfully signin the user

    return res.status(200).json({ ...ret });
  }

  @Post('change_password')
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    return res.status(200).json({ dfds: 'dsfdsfds' });
  }

  @Post('reset_password')
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    return res.status(200).json({ dfds: 'dsfdsfds' });
  }

  // all the get requests should go here
  @Post('reset_password')
  async signOut(
    @Body(new ValidationPipe()) sig: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    return res.status(200).json({ dfds: 'dsfdsfds' });
  }
}
