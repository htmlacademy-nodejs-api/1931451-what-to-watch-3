import { Expose, Type } from 'class-transformer';
import FilmListResponse from '../../film/response/film-list.response.js';

export default class WatchlistResponse {
  @Expose()
  public id!: string;

  @Expose({name: 'filmId'})
  @Type(() => FilmListResponse)
  public film!: FilmListResponse;
}
