import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  signIn(): void {
  }

  @Post('signup')
  signUp(): void {

  }

  @Post('change_password')
  changePassword(): void {

  }

  @Post('reset_password')
  resetPassword(): void {
    
  }
}
