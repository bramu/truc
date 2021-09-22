import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppAuthService } from './app-auth.service';

@Injectable()
export class AppLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private appAuthService: AppAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.appAuthService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
