import * as jose from 'jose';
import crypto from 'crypto';
import { GenreEnum } from '../types/genre.enum.js';
import { FilmType } from '../types/film.type.js';
import mongoose from 'mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorFieldType } from '../types/validation-error-field.type.js';
import { ServiceErrorEnum } from '../types/service-error.enum.js';
import { UnknownObjectType } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';

type GenresType = 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller';

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
    genre: GenreEnum[genre as GenresType],
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

export const getObjectId = (id: string) => {
  const ObjectId = mongoose.Types.ObjectId;

  return new ObjectId(id);
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (serviceError: ServiceErrorEnum ,message: string, details: ValidationErrorFieldType[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const getCurrentYear = (): number =>
  new Date().getFullYear();

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime(`${process.env.TOKEN_LIFE}`)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorFieldType[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

export const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObjectType,
  transformFn: (object: UnknownObjectType) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObjectType, transformFn);
      }
    });
};

export const transformObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownObjectType
) => {
  properties.forEach((property) => transformProperty(property, data, (target: UnknownObjectType) => {
    const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
    target[property] = `${rootPath}/${target[property]}`;
  }));
};
