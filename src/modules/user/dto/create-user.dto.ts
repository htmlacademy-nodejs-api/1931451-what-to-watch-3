import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export default class CreateUserDto {
  @IsString({message: 'username is required'})
  @Length(1, 15, {message: 'Min length is 1, max is 15'})
  public username!: string;

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsOptional()
  @MaxLength(256, {message: 'Too long path for field avatarPath'})
  @Matches(/^[a-zA-Z0-9-_]*[a-z0-9]\.(jpg|png)$/, {message: 'The format may be“.jpg” or «.png». File naming can only be in Latin letters and numbers and from special characters can only be “_–”'})
  public avatarPath?: string;

  @IsString({message: 'password is required'})
  @Length(6, 12, {message: 'Min length is 6, max is 15'})
  public password!: string;
}
