import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { WishService } from "../wishes.service";

@Injectable()
export class WishAuthorGuard implements CanActivate {
  constructor(private readonly wishService: WishService) { }
  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Получаю доступ к объекту запроса (Request)
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const wishId = parseInt(req.params.id, 10);

    return this.isUserWishAuthor(userId, wishId);
  }

  private async isUserWishAuthor(userId: number, wishId: number): Promise<boolean> {

    if (!userId) throw new ForbiddenException('У вас не достаточно прав');
    if (!wishId) throw new NotFoundException('Передайте нужные значения');

    const wishes = await this.wishService.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    })

    if (!wishes) throw new ForbiddenException('У вас не достаточно прав');

    const exists = wishes.some(wish => wish.id === wishId);

    if (!exists) throw new ForbiddenException('У вас не достаточно прав для удаления подарка');
    return exists;
  }
}