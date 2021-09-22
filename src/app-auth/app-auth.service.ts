import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppUserService } from '../app-user/app-user.service';

@Injectable()
export class AppAuthService {
  constructor(
    private appUserService: AppUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.appUserService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
