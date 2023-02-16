import { defaultClasses, getModelForClass, ModelOptions, Prop, Ref } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

export interface WatchlistEntity extends defaultClasses.Base {}

@ModelOptions({
  schemaOptions: {
    collection: 'watchlist'
  }
})
export class WatchlistEntity extends defaultClasses.TimeStamps {
  @Prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @Prop({
    ref: () => FilmEntity,
    required: true
  })
  public filmId!: Ref<FilmEntity>;
}

export const WatchlistModel = getModelForClass(WatchlistEntity);
