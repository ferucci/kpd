import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // если у обработчика нет данных о ролях, пропускаем запрос в контроллер
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // если у пользователя есть хотя бы одна нужная роль, запрос пройдёт дальше
    return roles.some((role) => user.roles.includes(role));
  }
}
