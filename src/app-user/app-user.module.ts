import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';

@Module({
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
