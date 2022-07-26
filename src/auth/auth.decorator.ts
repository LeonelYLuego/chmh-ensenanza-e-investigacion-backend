import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.header.Authorization;
    const user = await this.authService.authenticate(bearerToken);
    request.user = user;
    // If you want to allow the request even if auth fails, always return true
    return !!user;
  }
}

import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: string, req) => {
  return req.user;
});