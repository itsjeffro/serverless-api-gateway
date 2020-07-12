import { throws } from "assert";
import LoggerInterface from "./LoggerInterface";

class Logger implements LoggerInterface {
  logger: any;
  headers: object = {};

  constructor(logger: any) {
    this.logger = logger;
  }

  setHeader(key: string, value: any): this {
    this.headers = {
      ...this.headers,
      [key]: value,
    };

    return this;
  }

  buildLog(message: any): object {
    let log: any = {
      message: message,
    };

    if (Object.keys(this.headers).length !== 0) {
      log = {
        ...log,
        headers: this.headers,
      };
    }

    return log;
  }

  log(message: any): any {
    return this.logger.log(this.buildLog(message));
  }

  error(message: any): any {
    return this.logger.log(this.buildLog(message));
  }
}

export default Logger;
