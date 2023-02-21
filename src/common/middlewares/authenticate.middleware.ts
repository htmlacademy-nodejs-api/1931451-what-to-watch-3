import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { createSecretKey } from 'crypto';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const {payload} = await jose.jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));
      req.user = { email: payload.email as string, id: payload.id as string};

      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid Token',
        'AuthenticateMiddleware'
      ));
    }
  }
}
