import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TeamsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
