import { IsEmail, IsString, Length } from 'class-validator';
import { UserValidationEnum } from '../../../types/validation.enum.js';

export default class CreateUserDto {
  @IsString({message: UserValidationEnum.Username.IsString})
  @Length(UserValidationEnum.Username.MinLengthValue, UserValidationEnum.Username.MaxLengthValue, {message: UserValidationEnum.Username.LengthMessage})
  public username!: string;

  @IsEmail({}, {message: UserValidationEnum.Email.IsEmail})
  public email!: string;

  @IsString({message: UserValidationEnum.Password.IsString})
  @Length(UserValidationEnum.Password.MinLengthValue, UserValidationEnum.Password.MaxLengthValue, {message: UserValidationEnum.Password.LengthMessage})
  public password!: string;
}
