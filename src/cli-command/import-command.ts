import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createFilm, getErrorMessage } from '../utils/common.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { FilmServiceInterface } from '../modules/film/film-service.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import FilmService from '../modules/film/film.service.js';
import { FilmModel } from '../modules/film/film.entity.js';
import UserService from '../modules/user/user.service.js';
import { UserModel } from '../modules/user/user.entity.js';
import DatabaseService from '../common/database-client/database.service.js';
import { FilmType } from '../types/film.type.js';
import { getURI } from '../utils/db.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '12345';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private logger!: LoggerInterface;
  private filmService!: FilmServiceInterface;
  private userService!: UserServiceInterface;
  private databaseService!: DatabaseInterface;
  private salt!: string;

  constructor() {
    this.onRow = this.onRow.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.filmService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveFilm(film: FilmType) {
    const user = await this.userService.findByEmailOrCreate({
      ...film.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.filmService.create({
      ...film,
      userId: user.id
    });
  }

  private async onRow(row: string, resolve: () => void) {
    const film = createFilm(row);
    await this.saveFilm(film);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('row', this.onRow);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Не удалось импортировать данные из файла по причине: «${getErrorMessage(err)}»`);
    }
  }
}
