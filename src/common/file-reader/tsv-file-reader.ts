import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: 16384,
      encoding: 'utf-8'
    });

    let rowRead = '';
    let endRowPosition = -1;
    let importedRowCount = 0;

    for await (const chank of stream) {
      rowRead += chank.toString();

      while ((endRowPosition = rowRead.indexOf('\n')) >= 0) {
        const completeRow = rowRead.slice(0, endRowPosition + 1);
        rowRead = rowRead.slice(endRowPosition + 1);
        importedRowCount++;

        this.emit('row', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }
}
