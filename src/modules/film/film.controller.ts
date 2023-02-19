import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CheckUserMiddleware } from '../../common/middlewares/check-user.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middlewares.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { Component } from '../../types/component.type.js';
import { HttpMethodEnum } from '../../types/http-method.enum.js';
import { RequestQueryType } from '../../types/request-query.type.js';
import { fillDTO } from '../../utils/common.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { WatchlistServiceInterface } from '../watchlist/watchlist-service.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmListResponse from './response/film-list.response.js';
import FilmResponse from './response/film.response.js';

type ParamsGetFilm = {
  filmId: string;
  genre: string;
}

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.WatchlistServiceInterface) private readonly watchlistService: WatchlistServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({ path: '/', method: HttpMethodEnum.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethodEnum.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethodEnum.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethodEnum.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new CheckUserMiddleware(this.filmService, 'Film', 'filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethodEnum.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new CheckUserMiddleware(this.filmService, 'Film', 'filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethodEnum.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({path: '/genre/:genre', method: HttpMethodEnum.Get, handler: this.getFilmsFromGenre });
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    this.ok(res, fillDTO(FilmResponse, film));
  }

  public async index(
    req: Request<unknown, unknown, unknown, RequestQueryType>,
    res: Response
  ): Promise<void> {
    const {query, user} = req;
    const films = await this.filmService.find(query.limit);

    if (!user) {
      const result = films.map((film) => ({...film.toObject(), isFavorite: false}));
      this.ok(res, fillDTO(FilmListResponse, result));
      return;
    }

    const userWatchlist = await this.watchlistService.findByUserId(user.id);
    const userWatchlistId = userWatchlist.map((film) => film.filmId?.id);

    const result = films.map((film) => (
      {
        ...film.toObject(),
        isFavorite: userWatchlistId.includes(film.id)
      }
    ));

    this.ok(res, fillDTO(FilmListResponse, result));
  }

  public async getFilmsFromGenre(
    req: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQueryType>,
    res: Response
  ): Promise<void> {
    const {params, query, user} = req;
    const films = await this.filmService.findByGenre(params.genre, query.limit);

    if (!user) {
      const result = films.map((film) => ({...film.toObject(), isFavorite: false}));
      this.ok(res, fillDTO(FilmListResponse, result));
      return;
    }

    const userWatchlist = await this.watchlistService.findByUserId(user.id);
    const userWatchlistId = userWatchlist.map((film) => film.filmId?.id);

    const result = films.map((film) => (
      {
        ...film.toObject(),
        isFavorite: userWatchlistId.includes(film.id)
      }
    ));

    this.ok(res, fillDTO(FilmListResponse, result));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const existFilm = await this.filmService.findByName(body.name);

    if (existFilm) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with name «${body.name}» already exists.`,
        'FilmController'
      );
    }

    const result = await this.filmService.create({...body, userId: user.id});
    const film = await this.filmService.findById(result.id);
    this.created(res, fillDTO(FilmResponse, film));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.deleteById(params.filmId);

    await this.commentService.deleteByFilmId(params.filmId);
    this.noContent(res, film);
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const { body, params } = req;
    const updatedFilm = await this.filmService.updateById(params.filmId, body);

    this.ok(res, fillDTO(FilmResponse, updatedFilm));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
