import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Request,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    req.body.userId = 123;
    return true;
  }
}
