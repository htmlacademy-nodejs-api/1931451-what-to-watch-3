import typegoose, { defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { GenreEnum } from '../../types/genre.enum.js';

const {prop, modelOptions} = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true})
  public name!: string;

  @prop({required: true, trim: true})
  public description!: string;

  @prop({default: 0})
  public rating!: number;

  @prop({
    type: () => String,
    enum: GenreEnum
  })
  public genre!: GenreEnum;

  @prop()
  public released!: number;

  @prop()
  public runTime!: number;

  @prop()
  public director!: string;

  @prop({type: () => String})
  public starring!: string[];

  @prop()
  public posterImage!: string;

  @prop()
  public backgroundImage!: string;

  @prop()
  public backgroundColor!: string;

  @prop()
  public previewVideoLink!: string;

  @prop()
  public videoLink!: string;

  @prop({default: 0})
  public commentCount!: number;

  @prop()
  public publishDate!: Date;

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const FilmModel = getModelForClass(FilmEntity);
