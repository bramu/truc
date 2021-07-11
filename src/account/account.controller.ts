import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { SimpleAuthGuard } from '../users/simple-auth.guard';
// import { TestAuthGuard } from '../users/test-auth.guard';
import { AccountService } from './account.service';

@UseGuards(SimpleAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('invite')
  invite(@Req() req: Request): string {
    return 'this is for testing - ' + req.body.userId;
  }

  @Get('accept_invite')
  acceptInvite(): void {
    // TODO
  }

  @Post('test-route')
  async test(@Req() req: Request, @Res() res: Response): Promise<any> {
    // TODO
    return res.status(200).json({
      name: 'Rohit',
      age: 23,
    });
  }
}
