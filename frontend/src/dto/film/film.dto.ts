import { GenreEnum } from './genre.enum.js';
import UserDto from '../user/user.dto.js';

export type FilmType = {
  name: string;
  description: string;
  rating: number;
  genre: GenreEnum;
  released: number;
  runTime: number;
  director: string;
  starring: string[];
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  previewVideoLink: string;
  videoLink: string;
  commentCount: number;
  publishDate: Date;
  user: UserDto;
}
