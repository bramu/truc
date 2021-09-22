import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { AppAuthModule } from './app-auth/app-auth.module';
import { AppUserModule } from './app-user/app-user.module';

@Module({
  imports: [UsersModule, AccountModule, AppAuthModule, AppUserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
