import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { SignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return null; //this.users.find(user => user.username === username);
  }

  async signIn(user: User): Promise<any> {
    return null;
  }

  async createUser(signupDto: SignUpDto): Promise<any> {
    const tmp = await this.prisma.user.findFirst({
      where: {
        email: signupDto['email'],
      },
    });
    if (null != tmp) {
      return { message: 'Wrong Email' };
    }

    const tmp1 = await this.prisma.account.findFirst({
      where: {
        name: signupDto['account'],
      },
    });
    if (null != tmp1) {
      return { message: 'Wrong account' };
    }

    // create the user
    const user = await this.prisma.user.create({
      data: {
        email: signupDto['email'],
        password: signupDto['password'],
        name: signupDto['name'],
      },
    });

    // create the account
    const account = await this.prisma.account.create({
      data: {
        name: signupDto['account'],
        appId: '123',
      },
    });

    // create in user account with the role as admin
    await this.prisma.userAccount.create({
      data: {
        userId: user.id,
        accountId: account.id,
      },
    });

    // TODO finally send email to the user with trusender
    return null;
  }
}
