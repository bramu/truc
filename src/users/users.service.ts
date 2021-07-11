import { User } from '.prisma/client';
import { Injectable, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { SignUpDto, SignInDto } from './users.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { TruUtil } from '../common/utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return null; //this.users.find(user => user.username === username);
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    console.log(signInDto);

    const obj: any = {};

    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto['email'],
        password: TruUtil.getHash(TruUtil.decode(signInDto['password'])),
      },
    });

    if (user == null) {
      return obj;
    }

    const token: string = TruUtil.getJwt({
      name: user.name,
      email: user.email,
      id: user.id,
      status: user.status,
    });

    obj.message = 'Sign In Successfull';
    obj.data = user;
    obj.token = token;

    return obj;
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
          uniqueId: TruUtil.generateRandomString(),
          accounts: {
            create: {
              account: {
                create: {
                  name: signupDto['account'],
                  appId: TruUtil.generateRandomString(),
                  identitySecret: uuidv4(),
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

      //send email to confirm is pending TODO

      return { data: user, token };
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyUser(confirmationToken: any): Promise<any> {
    const res: any = {};

    const user = await this.prisma.user.findFirst({
      where: {
        confirmationToken,
      },
    });

    if (user != null) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: 'ACTIVE',
          confirmedAt: new Date(),
        },
      });

      res.success = true;
      res.message = 'Account Verified Successfully';
    }

    return res;
  }
}
