import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SimpleAuthGuard } from '../users/simple-auth.guard';
import { AccountService } from './account.service';
import {
  InvitationDto,
  DiscardInviteDto,
  CreateAccountDto,
} from './account.dto';
import { TruUtil } from '../common/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Get('create')
  async createAccount(
    @Body(new ValidationPipe())
    createAccountDto: CreateAccountDto,
    @Res() res: Response,
  ): Promise<any> {
    // TODO here we need to update the JWT token with the account id
    return res.status(200).json({ message: 'Successfully created account.' });
  }

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Get('switch')
  async switchAccount(@Req() req: Request, @Res() res: Response): Promise<any> {
    // TODO here we need to update the JWT token with the account id
    return res.status(200).json({ message: 'Successfully switched account.' });
  }

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Post('team/invite')
  async invite(
    @Body(new ValidationPipe()) invitationDto: InvitationDto,
    @Res() res: Response,
  ): Promise<any> {
    const teamInvite: any = await this.accountService.invite(invitationDto);
    return res.status(200).json({ ...teamInvite });
  }

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Post('team/discard')
  async discard(
    @Body(new ValidationPipe()) discardInviteDto: DiscardInviteDto,
    @Res() res: Response,
  ): Promise<any> {
    const inviteDiscard: any = await this.accountService.discard(
      discardInviteDto,
    );

    return res.status(inviteDiscard.status).json({ ...inviteDiscard });
  }

  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth()
  @Get('team/invite-info')
  async inviteInfo(@Req() req: Request, @Res() res: Response): Promise<any> {
    const viewInfo = await this.accountService.inviteInfo(req.query);
    return res.status(200).json({ ...viewInfo });
  }

  @Post('team/accept-invite')
  async acceptInvite(@Req() req: Request, @Res() res: Response): Promise<any> {
    const authorization: any =
      req.headers.authorization || req.headers.Authorization;

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.replace('Bearer ', '');

    const userDetails: any = TruUtil.letifyJwt(token);

    let isLoggedIn = true;

    let viewInfo: any;

    if (!userDetails) {
      isLoggedIn = false;
      viewInfo = await this.accountService.acceptInvite(req.body, isLoggedIn);
    } else {
      viewInfo = await this.accountService.acceptInvite(
        req.body,
        isLoggedIn,
        userDetails,
      );
    }

    return res.status(200).json({ ...viewInfo });
  }
}
