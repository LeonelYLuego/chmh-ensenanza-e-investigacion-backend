import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

/**
 * Validates if the current user is authorized
 * @class Authentication Middleware
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (/^\/api\//.test(req.originalUrl)) {
      const bearerToken = req.headers.authorization as undefined | string;
      const token = !!bearerToken ? bearerToken.replace('Bearer ', '') : null;
      const user = await this.authService.authenticate(token);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401);
        res.end();
      }
    } else next();
    // req.user = {
    //   username: 'leonel',
    //   password: 'leonel',
    //   administrator: true,
    // };
    // next();
  }
}
