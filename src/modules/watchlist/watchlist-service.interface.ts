import { DocumentType } from '@typegoose/typegoose';
import CreateWatchlistDto from './dto/create-watchlist.dto.js';
import { WatchlistEntity } from './watchlist.entity.js';

export interface WatchlistServiceInterface {
  create(dto: CreateWatchlistDto): Promise<DocumentType<WatchlistEntity>>;
  findByUserId(userId: string): Promise<DocumentType<WatchlistEntity>[]>;
  findByUserIdAndFilmId(userId: string, filmId: string): Promise<DocumentType<WatchlistEntity> | null>
  delete(filmId: string): Promise<number | null>;
}
