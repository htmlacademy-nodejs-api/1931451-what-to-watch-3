import typegoose, { getModelForClass, Ref, defaultClasses } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public commentText!: string;

  @prop({
    ref: () => FilmEntity,
    required: true
  })
  public filmId!: Ref<FilmEntity>;

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true})
  public commentRating!: number;

  @prop({required: true})
  public commentDate!: Date;
}

export const CommentModel = getModelForClass(CommentEntity);
