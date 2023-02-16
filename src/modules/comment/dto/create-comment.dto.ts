import { IsDateString, IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'commentText is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public commentText!: string;

  public userId!: string;

  @IsMongoId({message: 'filmId field must be a valid id'})
  public filmId!: string;

  @IsInt({message: 'commentRating must be an integer'})
  @Min(1, {message: 'Minimum value 1'})
  @Max(10, {message: 'Maximum value 10'})
  public commentRating!: number;

  @IsDateString({}, {message: 'commentDate must be valid ISO date'})
  public commentDate!: Date;
}
