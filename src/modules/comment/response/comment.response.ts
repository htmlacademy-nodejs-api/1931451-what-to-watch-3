import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public commentText!: string;

  @Expose()
  public commentRating!: number;

  @Expose()
  public commentDate!: Date;

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
