import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SimpleAuthGuard } from '../users/simple-auth.guard';
import { TestAuthGuard } from '../users/test-auth.guard';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @UseGuards(SimpleAuthGuard)
  @Get('invite')
  invite(@Req() req: Request): string {
    return "this is for testing - " + req.body.userId;
  }

  @UseGuards(TestAuthGuard)
  @Get('accept_invite')
  acceptInvite(): void {
    // TODO
  }
}
