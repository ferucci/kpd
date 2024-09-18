import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ValidUser implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const reqUserId = parseInt(req.params.id, 10);

    return this.ValidUser(userId, reqUserId);
  }

  private ValidUser(userId: number, reqUserId: number): boolean {

    if (!userId || !reqUserId) throw new NotFoundException('Передайте нужные значения');

    if (userId !== reqUserId) throw new ForbiddenException('У вас не достаточно прав');

    return true;
  }
}