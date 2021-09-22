import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppUserModule } from '../app-user/app-user.module';
import { AppAuthService } from './app-auth.service';
import { AppLocalStrategy } from './app-local.strategy';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    AppUserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AppAuthService, AppLocalStrategy, JwtStrategy],
  exports: [AppAuthService],
})
export class AppAuthModule {}
