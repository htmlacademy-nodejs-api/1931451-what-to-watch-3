import { IsMongoId } from 'class-validator';

export default class CreateWatchlistDto {
  public userId!: string;

  @IsMongoId({message: 'filmId field must be a valid id'})
  public filmId!: string;
}
