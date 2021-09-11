import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ChangePasswordDto,
  PwdResetLinkDto,
  SignInDto,
  SignUpDto,
} from './users.dto';
import { UsersService } from './users.service';
import { SimpleAuthGuard } from './simple-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.userService.signIn(signInDto);

    if (!user.data) {
      return res.status(200).json({ message: 'Invalid Data' });
    }

    return res.status(200).json({ ...user });
  }

  @Post('signup')
  async signUp(
    @Body(new ValidationPipe()) signupDto: SignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    // create the user first and then sign in
    const ret = await this.userService.createUser(signupDto);
    if (null == ret || null == ret.data) {
      return res.status(400).json(ret);
    }

    // once the user creates successfully signin the user

    return res.status(200).json({ ...ret, message: 'SignUp Successfull' });
  }

  @Get('verify-account')
  async verifyAccount(@Req() req: Request, @Res() res: Response): Promise<any> {
    const { confToken } = req.query;

    const result = await this.userService.verifyUser(confToken);

    if (!result.success) {
      if (result.message === 'Invalid Link') {
        return res.status(401).json({
          ...result,
        });
      }

      return res.status(400).json({
        message: 'Bad Request',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account Verified Successfully',
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe()) PwdResetLinkDto: PwdResetLinkDto,
    @Res() res: Response,
  ): Promise<any> {
    //TODO send email link for forgot password

    const result = await this.userService.getPwdLink(PwdResetLinkDto);

    return res.status(200).json({ ...result });
  }

  @Post('change-password')
  async changePassword(
    @Body(new ValidationPipe()) ChangePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    //TODO send email link for forgot password

    const result = await this.userService.changePassword(ChangePasswordDto);

    return res.status(200).json({ ...result });
  }

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    // @Body(new ValidationPipe()) ResetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.userService.resetPassword(req.body);

    if (!result.success) {
      return res.status(400).json({ ...result });
    }

    return res.status(200).json({
      success: true,
      message: 'password reset successfully',
    });
  }
}
