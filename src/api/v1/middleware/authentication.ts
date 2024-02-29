import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { requiresAuth } from 'express-openid-connect';

export class Authentication implements ExpressMiddlewareInterface {
  // Interface implementation is optional

  use(request: Request, response: Response, next: NextFunction): void {
    // Check if requiresAuth is defined before invoking it
    if (requiresAuth) {
      requiresAuth()(request, response, next);
    } else {
      next(new Error('requiresAuth is not defined'));
    }
  }
}
