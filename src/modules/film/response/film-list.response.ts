import { Expose, Type } from 'class-transformer';
import { GenreEnum } from '../../../types/genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class FilmListResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public genre!: GenreEnum;

  @Expose()
  public posterImage!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  public publishDate!: Date;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public isFavorite?: boolean;
}
