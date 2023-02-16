import { IsArray, IsDateString, IsEnum, IsHexColor, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { GenreEnum } from '../../../types/genre.enum.js';
import { getCurrentYear } from '../../../utils/common.js';

export default class CreateFilmDto {
  @IsString({message: 'name is required'})
  @MinLength(5, {message: 'Minimum name length must be 5'})
  @MaxLength(100, {message: 'Maximum name length must be 100'})
  public name!: string;

  @IsString({message: 'description is required'})
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsInt({message: 'rating must be an integer'})
  @Max(0, {message: 'Rating after creation cannot be more than 0'})
  public rating!: number;

  @IsEnum(GenreEnum ,{message: 'genre must be Comedy, Crime, Documentary, Drama, Horror, Family, Romance, Scifi or Thriller'})
  public genre!: GenreEnum;

  @IsInt({message: 'released must be an integer'})
  @Min(1895, {message: 'There were no films before 1895'})
  @Max(getCurrentYear(), {message: 'Unfortunately we can\'t add movies from the future'})
  public released!: number;

  @IsInt({message: 'runTime must be an integer'})
  @Min(1, {message: 'The film must be at least 1 minute long'})
  @Max(240, {message: 'Sorry, we can\'t post a movie longer than 4 hours'})
  public runTime!: number;

  @IsString({message: 'director is required'})
  @MinLength(2, {message: 'Minimum name director length must be 2'})
  @MaxLength(50, {message: 'Maximum name director length must be 50'})
  public director!: string;

  @IsArray({message: 'Field starring must be an array'})
  public starring!: string[];

  @IsString({message: 'posterImage is required'})
  @MaxLength(256, {message: 'Too long path for field posterImage'})
  @Matches(/^[a-zA-Z0-9-_]*[a-z0-9]\.jpg$/, {message: 'The format only “.jpg”. File naming can only be in Latin letters and numbers and from special characters can only be “_–”'})
  public posterImage!: string;

  @IsString({message: 'backgroundImage is required'})
  @MaxLength(256, {message: 'Too long path for field backgroundImage'})
  @Matches(/^[a-zA-Z0-9-_]*[a-z0-9]\.jpg$/, {message: 'The format only “.jpg”. File naming can only be in Latin letters and numbers and from special characters can only be “_–”'})
  public backgroundImage!: string;

  @IsHexColor({message: 'backgroundColor is required and must be in hexadecimal'})
  public backgroundColor!: string;

  @IsString({message: 'previewVideoLink is required'})
  @MaxLength(256, {message: 'Too long path for field previewVideoLink'})
  public previewVideoLink!: string;

  @IsString({message: 'videoLink is required'})
  @MaxLength(256, {message: 'Too long path for field videoLink'})
  public videoLink!: string;

  @IsDateString({}, {message: 'publishDate must be valid ISO date'})
  public publishDate!: Date;

  public userId!: string;
}
