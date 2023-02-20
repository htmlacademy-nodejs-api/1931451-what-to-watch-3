import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethodEnum } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmResponse from './response/film.response.js';

@injectable()
export default class PromoFilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for PromoFilmController...');

    this.addRoute({path: '/', method: HttpMethodEnum.Get, handler: this.getPromoFilm });
  }

  public async getPromoFilm(_req: Request, res: Response): Promise<void> {
    const promoFilm = await this.filmService.findPromoFilm();

    if (!promoFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Promo film not found',
        'FilmController'
      );
    }

    this.ok(res, fillDTO(FilmResponse, promoFilm));
  }
}
