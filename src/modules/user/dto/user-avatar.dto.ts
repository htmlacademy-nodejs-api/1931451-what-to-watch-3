import { Matches, MaxLength } from 'class-validator';
import { UserValidationEnum } from '../../../types/validation.enum.js';

export default class UserAvatarDto {
  @MaxLength(UserValidationEnum.AvatarPath.MaxLength.Value, {message: UserValidationEnum.AvatarPath.MaxLength.Message})
  @Matches(UserValidationEnum.AvatarPath.Matches.Value, {message: UserValidationEnum.AvatarPath.Matches.Message})
  public avatarPath!: string;
}
