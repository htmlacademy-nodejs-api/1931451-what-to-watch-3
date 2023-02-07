import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

const {Types} = mongoose;

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `«${objectId}» is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
