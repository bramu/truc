import { User } from '.prisma/client';
import { Injectable, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { SignUpDto } from './users.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { TruUtil } from '../common/utils';

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
      return { message: 'Email Already Exists. Please SignIn to continue.' };
    }

    const tmp1 = await this.prisma.account.findFirst({
      where: {
        name: signupDto['account'],
      },
    });
    if (null != tmp1) {
      return { message: 'User already exists with this account.' };
    }

    // create the user

    try {
      const user: any = await this.prisma.user.create({
        data: {
          email: signupDto['email'],
          password: TruUtil.getHash(TruUtil.decode(signupDto['password'])),
          name: signupDto['name'],
          uniqueId: uuidv4(),
          accounts: {
            create: {
              account: {
                create: {
                  name: signupDto['account'],
                  appId: uuidv4(),
                },
              },
            },
          },
        },
      });

      const token: string = TruUtil.getJwt({
        name: user.name,
        email: user.email,
        id: user.id,
        status: user.status,
      });

      //send email to confirm is pending

      return { user, token };
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }
}
