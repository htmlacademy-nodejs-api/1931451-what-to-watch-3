import { UserType } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  constructor(data: UserType) {
    super();

    this.username = data.username;
    this.email = data.email;
    this.avatarPath = data.avatarPath;
  }

  @prop({required: true, default: ''})
  public username!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: true, default: ''})
  public avatarPath!: string;

  @prop({required: true, default: ''})
  private password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
