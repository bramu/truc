import { Injectable, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import {
  SignUpDto,
  SignInDto,
  PwdResetLinkDto,
  ChangePasswordDto,
} from './users.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { TruUtil } from '../common/utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

    // insert the token in user token table
    await this.prisma.userToken.create({
      data: {
        userId: user.id,
        token: token,
      },
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
          password: TruUtil.getHash(TruUtil.decode(signupDto.password)),
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
      try {
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
        return res;
      } catch (error) {
        console.log(error);
        throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
      }
    } else {
      res.success = false;
      res.message = 'Invalid Link';
      return res;
    }
  }

  async getPwdLink(PwdResetLinkDto: PwdResetLinkDto): Promise<any> {
    const res: any = {};

    try {
      const user: any = await this.prisma.user.findFirst({
        where: {
          email: PwdResetLinkDto['email'],
        },
      });

      if (!user) {
        res.success = false;
        res.message = 'Email Not Found';
        return res;
      } else {
        //TODO generate reset pwd link
        //TODO send reset pwd link to mail
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            resetPasswordToken: uuidv4(),
            resetPasswordSentAt: new Date(),
          },
        });

        res.success = true;
        res.message = 'Link Created';
      }

      return res;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(ChangePasswordDto: ChangePasswordDto) {
    const res: any = {};
    try {
      if (
        ChangePasswordDto['password'] !== ChangePasswordDto['confirmPassword']
      ) {
        res.success = true;
        res.message = 'Confirm password is not same as password';
        return res;
      }

      const user: any = await this.prisma.user.findFirst({
        where: {
          resetPasswordToken: ChangePasswordDto['pwdResetToken'],
        },
      });

      if (!user) {
        res.success = false;
        res.message = 'Invalid Link';
        return res;
      } else {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: TruUtil.getHash(
              TruUtil.decode(ChangePasswordDto['password']),
            ),
            resetPasswordSentAt: null,
            resetPasswordToken: null,
          },
        });

        res.success = true;
        res.message = 'Password Changed Successfully';
      }

      return res;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(reqBody: any) {
    const res: any = {};
    try {
      if (
        TruUtil.dataBlankForAny(
          reqBody['oldPassword'],
          reqBody['newPassword'],
          reqBody['confirmPassword'],
        )
      ) {
        res.success = false;
        res.message = 'Mandatory Fields are missing';
        return res;
      }
      if (reqBody['newPassword'] !== reqBody['confirmPassword']) {
        res.success = false;
        res.message = 'Password and confirm passwords are not the same.';
        return res;
      }

      const user = await this.prisma.user.findFirst({
        where: {
          email: reqBody.email,
          password: TruUtil.getHash(TruUtil.decode(reqBody.oldPassword)),
        },
      });

      if (user === undefined || user === null) {
        res.success = false;
        res.message = 'Old password is invalid';
        return res;
      } else {
        await this.prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            password: TruUtil.getHash(TruUtil.decode(reqBody['newPassword'])),
            resetPasswordToken: null,
            resetPasswordSentAt: null,
          },
        });
        res.success = true;
        res.message = 'Password Reset Successfull';
      }

      return res;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }
}
