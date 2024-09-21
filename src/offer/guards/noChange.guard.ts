import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class NoChangeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return false;
  }
}