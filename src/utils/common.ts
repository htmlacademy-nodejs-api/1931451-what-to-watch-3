import crypto from 'crypto';
import { GenreEnum } from '../types/genre.enum.js';
import { FilmType } from '../types/film.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    rating,
    genre,
    released,
    runTime,
    director,
    starring,
    posterImage,
    backgroundImage,
    backgroundColor,
    previewVideoLink,
    videoLink,
    commentCount,
    publishDate,
    username,
    email,
    avatarPath
  ] = tokens;

  return {
    name,
    description,
    rating: Number.parseFloat(rating),
    genre: GenreEnum[genre as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller'],
    released: Number.parseInt(released, 10),
    runTime: Number.parseInt(runTime, 10),
    director,
    starring: starring.split(';'),
    posterImage,
    backgroundImage,
    backgroundColor,
    previewVideoLink,
    videoLink,
    commentCount: Number.parseInt(commentCount, 10),
    publishDate: new Date(publishDate),
    user: { username, email, avatarPath}
  } as FilmType;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
