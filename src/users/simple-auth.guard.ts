import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Request,
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
    req.body.userId = 123;

    const authorization =
      req.headers.authorization || req.headers.Authorization;

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.replace('Bearer ', '');

    if (!TruUtil.letifyJwt(token)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
