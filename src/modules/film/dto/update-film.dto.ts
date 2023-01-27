import { GenreEnum } from '../../../types/genre.enum.js';

export default class UpdateFilmDto {
  public name?: string;
  public description?: string;
  public rating?: number;
  public genre?: GenreEnum;
  public released?: number;
  public runTime?: number;
  public director?: string;
  public starring?: string[];
  public posterImage?: string;
  public backgroundImage?: string;
  public backgroundColor?: string;
  public previewVideoLink?: string;
  public videoLink?: string;
  public publishDate?: Date;
}
