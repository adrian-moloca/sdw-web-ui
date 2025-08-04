/**
 * @class Logger for logging all information in our app in console
 * In a future could be used with any console pickers
 */
export class Logger {
  static error(msg: any): void {
    console.error(msg);
  }

  static info(msg: any): void {
    console.info(msg);
  }

  static warn(msg: any): void {
    console.warn(msg);
  }

  static log(msg: any): void {
    console.log(msg);
  }
}
