import { IsArray, IsDateString, IsEnum, IsHexColor, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { GenreEnum } from '../../../types/genre.enum.js';
import { FilmValidationEnum } from '../../../types/validation.enum.js';

export default class CreateFilmDto {
  @IsString({message: FilmValidationEnum.Name.IsString})
  @MinLength(FilmValidationEnum.Name.MinLength.Value, {message: FilmValidationEnum.Name.MinLength.Message})
  @MaxLength(FilmValidationEnum.Name.MaxLength.Value, {message: FilmValidationEnum.Name.MaxLength.Message})
  public name!: string;

  @IsString({message: FilmValidationEnum.Description.IsString})
  @MinLength(FilmValidationEnum.Description.MinLength.Value, {message: FilmValidationEnum.Description.MinLength.Message})
  @MaxLength(FilmValidationEnum.Description.MaxLength.Value, {message: FilmValidationEnum.Description.MaxLength.Message})
  public description!: string;

  @IsInt({message: FilmValidationEnum.Rating.IsInt})
  @Min(FilmValidationEnum.Rating.Min.Value, {message: FilmValidationEnum.Rating.Min.Message})
  @Max(FilmValidationEnum.Rating.Max.Value, {message: FilmValidationEnum.Rating.Max.Message})
  public rating!: number;

  @IsEnum(GenreEnum ,{message: FilmValidationEnum.Genre.IsEnum})
  public genre!: GenreEnum;

  @IsInt({message: FilmValidationEnum.Released.IsInt})
  @Min(FilmValidationEnum.Released.Min.Value, {message: FilmValidationEnum.Released.Min.Message})
  @Max(FilmValidationEnum.Released.Max.Value, {message: FilmValidationEnum.Released.Max.Message})
  public released!: number;

  @IsInt({message: FilmValidationEnum.RunTime.IsInt})
  @Min(FilmValidationEnum.RunTime.Min.Value, {message: FilmValidationEnum.RunTime.Min.Message})
  @Max(FilmValidationEnum.RunTime.Max.Value, {message: FilmValidationEnum.RunTime.Max.Message})
  public runTime!: number;

  @IsString({message: FilmValidationEnum.Director.IsString})
  @MinLength(FilmValidationEnum.Director.MinLength.Value, {message: FilmValidationEnum.Director.MinLength.Message})
  @MaxLength(FilmValidationEnum.Director.MaxLength.Value, {message: FilmValidationEnum.Director.MaxLength.Message})
  public director!: string;

  @IsArray({message: FilmValidationEnum.Starring.IsArray})
  public starring!: string[];

  @IsString({message: FilmValidationEnum.PosterImage.IsString})
  @MaxLength(FilmValidationEnum.PosterImage.MaxLength.Value, {message: FilmValidationEnum.PosterImage.MaxLength.Message})
  @Matches(FilmValidationEnum.PosterImage.Matches.Value, {message: FilmValidationEnum.PosterImage.Matches.Message})
  public posterImage!: string;

  @IsString({message: FilmValidationEnum.BackgroundImage.IsString})
  @MaxLength(FilmValidationEnum.BackgroundImage.MaxLength.Value, {message: FilmValidationEnum.BackgroundImage.MaxLength.Message})
  @Matches(FilmValidationEnum.BackgroundImage.Matches.Value, {message: FilmValidationEnum.BackgroundImage.Matches.Message})
  public backgroundImage!: string;

  @IsHexColor({message: FilmValidationEnum.BackgroundColor.IsHexColor})
  public backgroundColor!: string;

  @IsString({message: FilmValidationEnum.PreviewVideoLink.IsString})
  @MaxLength(FilmValidationEnum.PreviewVideoLink.MaxLength.Value, {message: FilmValidationEnum.PreviewVideoLink.MaxLength.Message})
  @Matches(FilmValidationEnum.PreviewVideoLink.Matches.Value, {message: FilmValidationEnum.PreviewVideoLink.Matches.Message})
  public previewVideoLink!: string;

  @IsString({message: FilmValidationEnum.VideoLink.IsString})
  @MaxLength(FilmValidationEnum.VideoLink.MaxLength.Value, {message: FilmValidationEnum.VideoLink.MaxLength.Message})
  @Matches(FilmValidationEnum.VideoLink.Matches.Value, {message: FilmValidationEnum.VideoLink.Matches.Message})
  public videoLink!: string;

  @IsDateString({}, {message: FilmValidationEnum.PublishDate.IsDateString})
  public publishDate!: Date;

  public userId!: string;
}
