import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethodEnum } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmResponse from './response/film.response.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({ path: '/', method: HttpMethodEnum.Get, handler: this.find });
    this.addRoute({ path: '/', method: HttpMethodEnum.Post, handler: this.create });
  }

  public async find(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find(1);
    const filmResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmResponse);
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const existCategory = await this.filmService.findByName(body.name);

    if (existCategory) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with name «${body.name}» already exists.`,
        'FilmController'
      );
    }

    const result = await this.filmService.create(body);
    const resultResponse = fillDTO(FilmResponse, result);
    this.created(res, resultResponse);
  }
}
