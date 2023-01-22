import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/component.type.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity, FilmModel } from './film.entity.js';
import FilmService from './film.service.js';

const filmContainer = new Container();

filmContainer.bind<FilmServiceInterface>(Component.FilmServiceInterface).to(FilmService).inSingletonScope();
filmContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);

export {filmContainer};
