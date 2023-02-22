import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import CreateWatchlistDto from './dto/create-watchlist.dto.js';
import { WatchlistServiceInterface } from './watchlist-service.interface.js';
import { WatchlistEntity } from './watchlist.entity.js';

@injectable()
export default class WatchlistService implements WatchlistServiceInterface {
  constructor(
    @inject(Component.WatchlistModel) private readonly watchlistModel: types.ModelType<WatchlistEntity>
  ) {}

  public async create(dto: CreateWatchlistDto): Promise<DocumentType<WatchlistEntity>> {
    const watchlist = await this.watchlistModel.create(dto);
    return watchlist.populate({
      path: 'filmId',
      populate: {
        path: 'userId'
      }
    });
  }

  public async findByUserId(userId: string): Promise<DocumentType<WatchlistEntity>[]> {
    return await this.watchlistModel
      .find({userId})
      .populate({
        path: 'filmId',
        populate: {
          path: 'userId'
        }
      })
      .exec();
  }

  public async findByUserIdAndFilmId(userId: string, filmId: string): Promise<DocumentType<WatchlistEntity> | null> {
    return await this.watchlistModel
      .find({userId})
      .findOne({filmId})
      .exec();
  }

  public async delete(userId: string, filmId: string): Promise<void> {
    await this.watchlistModel
      .deleteMany({userId, filmId})
      .exec();
  }

  public async deleteMany(filmId: string): Promise<number | null> {
    const result = await this.watchlistModel
      .deleteMany({filmId})
      .exec();

    return result.deletedCount;
  }
}
