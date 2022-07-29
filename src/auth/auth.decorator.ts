import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '@users/dtos';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserDto | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
