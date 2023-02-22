import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FilmServiceInterface } from '../../modules/film/film-service.interface.js';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class CheckUserMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: FilmServiceInterface,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {params, user} = req;
    const documentId = params[this.paramName];
    const film = await this.service.findById(documentId);

    if (film?.userId?.id === user.id) {
      return next();
    }

    throw new HttpError(
      StatusCodes.FORBIDDEN,
      `${this.entityName} with ${documentId} not edit`,
      'CheckUserMiddleware'
    );
  }
}
