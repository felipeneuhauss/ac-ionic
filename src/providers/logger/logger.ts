import {Injectable} from "@angular/core";

/*
  Generated class for the LoggerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoggerProvider {

  info (msg: any) { console.info(msg); }
  log (msg: any) { console.log(msg); }
  warn (msg: any) { console.warn(msg); }
  error (msg: any) { console.error(msg); }

}
