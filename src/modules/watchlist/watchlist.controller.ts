import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middlewares.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { Component } from '../../types/component.type.js';
import { HttpMethodEnum } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import CreateWatchlistDto from './dto/create-watchlist.dto.js';
import WatchlistResponse from './response/watchlist.response.js';
import { WatchlistServiceInterface } from './watchlist-service.interface.js';

@injectable()
export default class WatchlistController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.WatchlistServiceInterface) private readonly watchlistService: WatchlistServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for WatchlistController…');
    this.addRoute({
      path: '/',
      method: HttpMethodEnum.Post,
      handler: this.createOrDelete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateWatchlistDto)
      ]
    });
  }

  public async createOrDelete(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateWatchlistDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;

    if (!await this.filmService.exists(body.filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${body.filmId} not found.`,
        'WatchlistController'
      );
    }

    if (await this.watchlistService.findByUserIdAndFilmId(user.id, body.filmId)) {
      this.noContent(res, this.watchlistService.delete(body.filmId));
      return;
    }

    const result = await this.watchlistService.create({...body, userId: user.id});
    this.ok(res, fillDTO(WatchlistResponse, result));
  }
}
