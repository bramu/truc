import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [PassportModule],
  providers: [UsersService, AuthService, LocalStrategy, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
