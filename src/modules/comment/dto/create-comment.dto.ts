import { IsDateString, IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CommentValidationEnum } from '../../../types/validation.enum.js';

export default class CreateCommentDto {
  @IsString({message: CommentValidationEnum.CommentText.IsString})
  @Length(CommentValidationEnum.CommentText.MinLengthValue, CommentValidationEnum.CommentText.MaxLengthValue, {message: CommentValidationEnum.CommentText.LengthMessage})
  public commentText!: string;

  public userId!: string;

  @IsMongoId({message: CommentValidationEnum.FilmId.IsMongoId})
  public filmId!: string;

  @IsInt({message: CommentValidationEnum.CommentRating.IsInt})
  @Min(CommentValidationEnum.CommentRating.Min.Value, {message: CommentValidationEnum.CommentRating.Min.Message})
  @Max(CommentValidationEnum.CommentRating.Max.Value, {message: CommentValidationEnum.CommentRating.Max.Message})
  public commentRating!: number;

  @IsDateString({}, {message: CommentValidationEnum.commentDate.IsDateString})
  public commentDate!: Date;
}
