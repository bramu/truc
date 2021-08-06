import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TruUtil } from '../common/utils';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization =
      req.headers.authorization || req.headers.Authorization;

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.replace('Bearer ', '');

    if (!TruUtil.letifyJwt(token)) {
      throw new UnauthorizedException();
    }

    // TODO here we need to check the token is valid or not from user token table

    return true;
  }
}
