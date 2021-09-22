import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AppAuthService } from './app-auth/app-auth.service';
import { AppLocalAuthGuard } from './app-auth/app-local-auth.guard';
import { JwtAuthGuard } from './app-auth/jwt-auth.guard';
import { AppService } from './app.service';

@ApiTags('Common')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appAuthService: AppAuthService,
  ) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(AppLocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.appAuthService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
