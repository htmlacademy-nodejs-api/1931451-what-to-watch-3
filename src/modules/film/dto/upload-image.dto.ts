import { IsString, Matches, MaxLength } from 'class-validator';
import { FilmValidationEnum } from '../../../types/validation.enum.js';

export default class UploadImageDto {
  @IsString({message: FilmValidationEnum.PosterImage.IsString})
  @MaxLength(FilmValidationEnum.PosterImage.MaxLength.Value, {message: FilmValidationEnum.PosterImage.MaxLength.Message})
  @Matches(FilmValidationEnum.PosterImage.Matches.Value, {message: FilmValidationEnum.PosterImage.Matches.Message})
  public posterImage!: string;

  @IsString({message: FilmValidationEnum.BackgroundImage.IsString})
  @MaxLength(FilmValidationEnum.BackgroundImage.MaxLength.Value, {message: FilmValidationEnum.BackgroundImage.MaxLength.Message})
  @Matches(FilmValidationEnum.BackgroundImage.Matches.Value, {message: FilmValidationEnum.BackgroundImage.Matches.Message})
  public backgroundImage!: string;
}
