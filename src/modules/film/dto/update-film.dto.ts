import { IsArray, IsDateString, IsEnum, IsHexColor, IsInt, IsOptional, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { GenreEnum } from '../../../types/genre.enum.js';
import { FilmValidationEnum } from '../../../types/validation.enum.js';

export default class UpdateFilmDto {
  @IsOptional()
  @MinLength(FilmValidationEnum.Name.MinLength.Value, {message: FilmValidationEnum.Name.MinLength.Message})
  @MaxLength(FilmValidationEnum.Name.MaxLength.Value, {message: FilmValidationEnum.Name.MaxLength.Message})
  public name?: string;

  @IsOptional()
  @MinLength(FilmValidationEnum.Description.MinLength.Value, {message: FilmValidationEnum.Description.MinLength.Message})
  @MaxLength(FilmValidationEnum.Description.MaxLength.Value, {message: FilmValidationEnum.Description.MaxLength.Message})
  public description?: string;

  @IsOptional()
  @IsEnum(GenreEnum ,{message: FilmValidationEnum.Genre.IsEnum})
  public genre?: GenreEnum;

  @IsOptional()
  @IsInt({message: FilmValidationEnum.Released.IsInt})
  @Min(FilmValidationEnum.Released.Min.Value, {message: FilmValidationEnum.Released.Min.Message})
  @Max(FilmValidationEnum.Released.Max.Value, {message: FilmValidationEnum.Released.Max.Message})
  public released?: number;

  @IsOptional()
  @IsInt({message: FilmValidationEnum.RunTime.IsInt})
  @Min(FilmValidationEnum.RunTime.Min.Value, {message: FilmValidationEnum.RunTime.Min.Message})
  @Max(FilmValidationEnum.RunTime.Max.Value, {message: FilmValidationEnum.RunTime.Max.Message})
  public runTime?: number;

  @IsOptional()
  @MinLength(FilmValidationEnum.Director.MinLength.Value, {message: FilmValidationEnum.Director.MinLength.Message})
  @MaxLength(FilmValidationEnum.Director.MaxLength.Value, {message: FilmValidationEnum.Director.MaxLength.Message})
  public director?: string;

  @IsOptional()
  @IsArray({message: FilmValidationEnum.Starring.IsArray})
  public starring?: string[];

  @IsOptional()
  @MaxLength(FilmValidationEnum.PosterImage.MaxLength.Value, {message: FilmValidationEnum.PosterImage.MaxLength.Message})
  @Matches(FilmValidationEnum.PosterImage.Matches.Value, {message: FilmValidationEnum.PosterImage.Matches.Message})
  public posterImage?: string;

  @IsOptional()
  @MaxLength(FilmValidationEnum.BackgroundImage.MaxLength.Value, {message: FilmValidationEnum.BackgroundImage.MaxLength.Message})
  @Matches(FilmValidationEnum.BackgroundImage.Matches.Value, {message: FilmValidationEnum.BackgroundImage.Matches.Message})
  public backgroundImage?: string;

  @IsOptional()
  @IsHexColor({message: FilmValidationEnum.BackgroundColor.IsHexColor})
  public backgroundColor?: string;

  @IsOptional()
  @MaxLength(FilmValidationEnum.PreviewVideoLink.MaxLength.Value, {message: FilmValidationEnum.PreviewVideoLink.MaxLength.Message})
  @Matches(FilmValidationEnum.PreviewVideoLink.Matches.Value, {message: FilmValidationEnum.PreviewVideoLink.Matches.Message})
  public previewVideoLink?: string;

  @IsOptional()
  @MaxLength(FilmValidationEnum.VideoLink.MaxLength.Value, {message: FilmValidationEnum.VideoLink.MaxLength.Message})
  @Matches(FilmValidationEnum.VideoLink.Matches.Value, {message: FilmValidationEnum.VideoLink.Matches.Message})
  public videoLink?: string;

  @IsOptional()
  @IsDateString({}, {message: FilmValidationEnum.PublishDate.IsDateString})
  public publishDate?: Date;
}
