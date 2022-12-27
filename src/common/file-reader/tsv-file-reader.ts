import { readFileSync } from 'fs';
import { GenreEnum } from '../../types/genre.enum.js';
import { FilmType } from '../../types/film.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TsvFileReader implements FileReaderInterface {
  private rawData = '';

  constructor (public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): FilmType[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
      ]) => ({
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
      }));
  }
}


// GenreEnum[type as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller']
