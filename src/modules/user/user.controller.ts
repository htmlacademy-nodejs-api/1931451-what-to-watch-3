import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middlewares.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { Component } from '../../types/component.type.js';
import { HttpMethodEnum } from '../../types/http-method.enum.js';
import { createJWT, fillDTO } from '../../utils/common.js';
import FilmListResponse from '../film/response/film-list.response.js';
import { WatchlistServiceInterface } from '../watchlist/watchlist-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import LoggedUserResponse from './response/logged-user.response.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';
import UserResponse from './response/user.response.js';
import { UserServiceInterface } from './user-service.interface.js';
import { JWT_ALGORITM } from './user.constant.js';

const USER_ID = 'userId';
const AVATAR_FIELD = 'avatarPath';

type ParamsGetUser = {
  userId: string;
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.WatchlistServiceInterface) private readonly watchlistService: WatchlistServiceInterface
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethodEnum.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethodEnum.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethodEnum.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethodEnum.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(USER_ID),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), AVATAR_FIELD)
      ]
    });
    this.addRoute({
      path: '/:userId/watchlist',
      method: HttpMethodEnum.Get,
      handler: this.getUserWatchlist,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(USER_ID),
      ]
    });
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const { body, user } = req;
    const existsUser = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Only anonymous users can create an account.',
        'UserController'
      );
    }

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    const responseResult = fillDTO(UserResponse, result);
    this.created(res, responseResult);
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id, }
    );

    this.ok(res, {
      ...fillDTO(LoggedUserResponse, user),
      token
    });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const {userId} = req.params;
    const uploadFile = {avatarPath: req.file?.filename};

    if (userId !== req.user.id) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Can\'t change another user\'s avatar',
        'UserController'
      );
    }

    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
  }

  public async checkAuthenticate(req: Request, res: Response) {
    if (! req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  public async getUserWatchlist(
    {params}: Request<core.ParamsDictionary | ParamsGetUser, object, object>,
    res: Response
  ): Promise<void> {

    if (!await this.userService.findById(params.userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${params.userId} not found.`,
        'UserController'
      );
    }

    const watchlist = await this.watchlistService.findByUserId(params.userId);
    const filmList = watchlist.map((film) => ({
      ...film.toObject().filmId,
      isFavorite: true,
      id: film.filmId?.id
    }));

    this.ok(res, fillDTO(FilmListResponse, filmList));
  }
}
