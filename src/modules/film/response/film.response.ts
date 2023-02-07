import { Expose, Type } from 'class-transformer';
import { GenreEnum } from '../../../types/genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public genre!: GenreEnum;

  @Expose()
  public released!: number;

  @Expose()
  public runTime!: number;

  @Expose()
  public director!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public publishDate!: Date;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
