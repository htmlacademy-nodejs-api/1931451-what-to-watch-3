import dayjs from 'dayjs';
import { MockDataType } from '../../types/mock-data.type.js';
import { GenreEnum } from '../../types/genre.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const MIN_RATING = 8;
const MAX_RATING = 10;
const NUM_AFTER_DIGIT = 1;

const RELEASED_FROM = 1970;
const RELEASED_TO = 2015;

const RUN_TIME_FROM = 25;
const RUN_TIME_TO = 180;

const COMMENT_MIN = 0;
const COMMENT_MAX = 100;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const arrayGenres = Array.from(Object.values(GenreEnum));

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockDataType) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, NUM_AFTER_DIGIT).toString();
    const genre = getRandomItem<string>(arrayGenres);
    const released = generateRandomValue(RELEASED_FROM, RELEASED_TO).toString();
    const runTime = generateRandomValue(RUN_TIME_FROM, RUN_TIME_TO).toString();
    const director = getRandomItem<string>(this.mockData.director);
    const starring = getRandomItems<string>(this.mockData.starring).join(';');
    const posterImage = getRandomItem<string>(this.mockData.posterImage);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImage);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColor);
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLink);
    const videoLink = getRandomItem<string>(this.mockData.videoLink);
    const commentCount = generateRandomValue(COMMENT_MIN, COMMENT_MAX).toString();
    const publishDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const username = getRandomItem<string>(this.mockData.username);
    const email = getRandomItem<string>(this.mockData.email);
    const avatarPath = getRandomItem<string>(this.mockData.avatarPath);

    return [
      name, description, rating, genre, released,
      runTime, director, starring, posterImage, backgroundImage,
      backgroundColor, previewVideoLink, videoLink, commentCount, publishDate,
      username, email, avatarPath
    ].join('\t');
  }
}
