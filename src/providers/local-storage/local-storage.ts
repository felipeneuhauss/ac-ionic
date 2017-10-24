import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {

  constructor(public http: Http) {
    console.log('Hello LocalStorageProvider Provider');
  }

  get (item: string) : any {
    let value : any = localStorage.getItem(item);
    if (value !== undefined && value != null && value !== 'undefined') {
      return JSON.parse(localStorage.getItem(item));
    }
    return null;
  }
  set (item: string, value: any) { localStorage.setItem(item, JSON.stringify(value)); }
  remove (item: string) { localStorage.removeItem(item); }

}
