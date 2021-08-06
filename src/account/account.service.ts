import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { InvitationDto, DiscardInviteDto } from './account.dto';
import { TruUtil } from '../common/utils';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async invite(InvitationDto: InvitationDto): Promise<any> {
    try {
      const appId: string = InvitationDto['appId'];

      const emails: Array<[]> = InvitationDto['emails'];

      const respObj: any = {};

      const account: any = this.prisma.account.findFirst({
        where: {
          appId,
        },
      });

      if (account == null) {
        respObj.success = false;
        respObj.message = 'Account Doesn Not Exist';
      }

      for (const i in emails) {
        const email: string = i;

        let user: any = await this.prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (user == null) {
          user = await this.prisma.user.create({
            data: {
              email,
              uniqueId: TruUtil.generateRandomString(),
              name: '',
            },
          });
        }

        const userAccount: any = await this.prisma.userAccount.findFirst({
          where: {
            user,
            account,
          },
        });

        if (userAccount == null) {
          await this.prisma.userAccount.create({
            data: {
              user,
              account,
              status: 'CONFIRMATION_PENDING',
            },
          });
        } else {
          await this.prisma.userAccount.update({
            where: {
              id: userAccount.id,
            },
            data: {
              status: 'CONFIRMATION_PENDING',
            },
          });
        }
      }

      return {
        message: 'Invites Send Successfully',
        success: true,
      };
    } catch (error) {
      console.log('Invite Error In team members');
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async discard(discardInviteDto: DiscardInviteDto): Promise<any> {
    try {
      const { email, appId } = discardInviteDto;

      const user: any = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (user == null) {
        return {
          status: 404,
          success: false,
          message: "User Doesn't exist.",
        };
      }

      const account: any = await this.prisma.account.findFirst({
        where: {
          appId,
        },
      });

      await this.prisma.userAccount.updateMany({
        where: {
          user,
          account,
        },
        data: {
          status: 'INACTIVE',
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Request Discarded Successfully',
      };
    } catch (error) {
      console.log('Discard Error In team members');
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async inviteInfo(inviteObj: any): Promise<any> {
    try {
      const { appId, uniqueId } = inviteObj;

      const user: any = await this.prisma.user.findFirst({
        where: {
          uniqueId,
        },
        select: {
          name: true,
          email: true,
          uniqueId: true,
          status: true,
        },
      });

      if (user == null) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      const account: any = await this.prisma.account.findFirst({
        where: {
          appId,
        },
        select: {
          name: true,
        },
      });

      if (account == null) {
        throw new HttpException('Account Not Found', HttpStatus.NOT_FOUND);
      }

      const responseObj: any = {};

      responseObj.accountName = account.name;
      responseObj.user = {
        ...user,
      };

      return {
        success: true,
        message: 'User Info',
        data: { ...responseObj },
      };
    } catch (error) {
      console.log('Discard Error In team members');
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async acceptInvite(
    acceptObj: any,
    isLoggedIn: boolean,
    userData?: any,
  ): Promise<any> {
    const user: any = await this.prisma.user.findFirst({
      where: {
        uniqueId: acceptObj.uniqueId,
      },
    });

    const account: any = await this.prisma.account.findFirst({
      where: {
        appId: acceptObj.appId,
      },
    });

    let status = false;

    if (user == null || account == null) {
      console.log("User Doesn't Exist");
      console.log('Invalid Invitation');
      throw new HttpException('Invalid Invitation', HttpStatus.BAD_REQUEST);
    }

    if (isLoggedIn) {
      if (userData.email !== user.email) {
        console.log('Unauthorized Session');
        throw new HttpException('Unauthorized Session', HttpStatus.FORBIDDEN);
      }

      const { password } = acceptObj;

      if (TruUtil.getHash(TruUtil.decode(password)) !== user.password) {
        console.log('Invalid User');
        throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);
      }
    } else {
      if (user.password == null) {
        if (acceptObj.password !== acceptObj.confirmPassword) {
          console.log('Password Dont match');
          throw new HttpException(
            'Password Dont match',
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.prisma.user.updateMany({
          where: {
            id: user.id,
          },
          data: {
            password: TruUtil.getHash(TruUtil.decode(acceptObj.password)),
            confirmedAt: new Date(),
            status: 'ACTIVE',
          },
        });
      }
    }
    status = true;

    await this.prisma.userAccount.updateMany({
      where: {
        user,
        account,
      },
      data: {
        status: 'CONFIRMED',
        updatedAt: new Date(),
      },
    });
    return {
      success: status,
      message: 'Invited Accepted Successfully',
    };
  }
}
