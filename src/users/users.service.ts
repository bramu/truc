import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

  async findOne(username: string): Promise<User | undefined> {
    return null;//this.users.find(user => user.username === username);
  }
}
