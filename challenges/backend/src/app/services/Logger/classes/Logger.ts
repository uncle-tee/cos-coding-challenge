import { injectable } from 'inversify';

import { ILogger } from '../interface/ILogger';
import 'reflect-metadata';

@injectable()
export class Logger implements ILogger {
  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  error(message: string, data?: object): void {
    if (data) {
      console.log(
        `[LOG]: ${message} ==>  payload Data ${JSON.stringify(data)}`,
      );
    } else {
      console.log(`[LOG]: ${message}`);
    }
  }
}
