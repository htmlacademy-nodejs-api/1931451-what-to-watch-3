export default class CreateCommentDto {
  public commentText!: string;
  public userId!: string;
  public filmId!: string;
  public commentRating!: number;
  public commentDate!: Date;
}
