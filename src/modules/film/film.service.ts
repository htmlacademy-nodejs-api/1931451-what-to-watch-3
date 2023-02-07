import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DEFAULT_FILM_COUNT } from './film.constant.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { SortEnum } from '../../types/sort.enum.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate(['userId'])
      .exec();
  }

  public async findByName(filmName: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name: filmName});
  }

  public async findByNameOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const existedFilm = await this.findByName(filmName);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }

  public async find(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count || DEFAULT_FILM_COUNT;
    return this.filmModel
      .find()
      .sort({createdAt: SortEnum.Down})
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findByGenre(genreName: string, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count || DEFAULT_FILM_COUNT;
    const genre = genreName[0].toUpperCase() + genreName.slice(1);
    return this.filmModel
      .find({genre})
      .sort({createdAt: SortEnum.Down})
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: documentId})) !== null;
  }
}
