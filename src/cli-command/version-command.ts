import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  static readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute(): Promise<void> {
    const version = VersionCommand.readVersion();
    console.log(chalk.blue(version));
  }
}
