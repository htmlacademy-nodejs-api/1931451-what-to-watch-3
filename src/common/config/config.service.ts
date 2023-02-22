import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from './config.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { configSchema, ConfigSchemaType } from './config.schema.js';
import { Component } from '../../types/component.type.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private config: ConfigSchemaType;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {
    const parseOutput = config();

    if (parseOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }


  public get<T extends keyof ConfigSchemaType>(key: T): ConfigSchemaType[T]{
    return this.config[key];
  }
}
