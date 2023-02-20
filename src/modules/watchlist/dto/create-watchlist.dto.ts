import { IsMongoId } from 'class-validator';
import { WatchlistValidationEnum } from '../../../types/validation.enum.js';

export default class CreateWatchlistDto {
  public userId!: string;

  @IsMongoId({message: WatchlistValidationEnum.FilmId.IsMongoId})
  public filmId!: string;
}
