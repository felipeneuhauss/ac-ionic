import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {LocalStorageProvider} from "../local-storage/local-storage";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public static baseUrl : string = 'http://api.aguacinza.eco.br';

  constructor(public http: Http, private storage: LocalStorageProvider) {
    console.log('Hello AuthProvider Provider');
  }

  setToken(token: string, expiration: any) {
    this.storage.set('token', token);
    this.storage.set('expiration', expiration);
  }

  hasToken() {
    var token = this.storage.get('token');
    var expiration = this.storage.get('expiration');
    if (token === undefined || !token || !expiration || token == 'undefined') {
      return false;
    }

    return true;
  }

  getToken() {
    var token = this.storage.get('token');
    var expiration = this.storage.get('expiration');

    if (token === undefined || !token || !expiration || token == 'undefined') {
      return null;
    }

    if (Date.now() > parseInt(expiration)) {
      this.destroyToken();
      let user: any = this.storage.get('user');
      if (user) {
        this.http.post(AuthProvider.baseUrl + '/oauth/token', user).subscribe(
            (response: any) => {
              this.setToken(response.access_token, response.expires_in + Date.now());
              return response.access_token;
            }
        );
      }
    } else {
      return token;
    }
  }

  destroyToken() {
    this.storage.remove('token');
    this.storage.remove('expiration');
  }


  user() {
    return this.storage.get('user');
  }
}
