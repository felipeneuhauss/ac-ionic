import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LocalStorageProvider } from '../local-storage/local-storage';

/*
  Generated class for the TokenManagerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TokenManagerProvider {

  constructor(public http: Http, private storage: LocalStorageProvider) {
    console.log('Hello TokenManagerProvider Provider');
  }

    setToken(token: string, expiration: any) {
        this.storage.set('token', token);
        this.storage.set('expiration', expiration);
    }

    validateToken(token, expiration) {

        if (token === undefined || !token || !expiration || token == 'undefined') {
            return false;
        }

        return !(Date.now() > parseInt(expiration));
    }

    getToken(): Promise<any> {
        return new Promise((resolve) => {
            let token = this.storage.get('token');
            let expiration = this.storage.get('expiration');

            if(this.validateToken(token, expiration)) {
                resolve(token);
                return;
            }

            resolve(null);
            return;
        });
    }

    getStaticToken(): string {
      return this.storage.get('token');
    }

    hasToken() {
        let token = this.storage.get('token');
        let expiration = this.storage.get('expiration');
        return !(token === undefined || !token || !expiration || token == 'undefined');
    }

    destroyToken() {
        this.storage.remove('token');
        this.storage.remove('expiration');
    }


}
