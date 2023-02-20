import { IsEmail, IsString } from 'class-validator';
import { UserValidationEnum } from '../../../types/validation.enum.js';

export default class LoginUserDto {
  @IsEmail({}, {message: UserValidationEnum.Email.IsEmail})
  public email!: string;

  @IsString({message: UserValidationEnum.Password.IsString})
  public password!: string;
}
