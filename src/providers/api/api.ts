import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';
import {LoadingController} from "ionic-angular";
import { TokenManagerProvider } from '../token-manager/token-manager';

export const BASE_URL = 'http://api.aguacinza.eco.br/';
export const API_URL = BASE_URL + 'api/';

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class ApiProvider {

    private headers: Headers = new Headers();

    constructor(private http: Http,
                private tokenManager: TokenManagerProvider,
                public loading: LoadingController) {
        this.initializeApi();
        console.log('ApiProvider');
    }

    initializeApi() {
        if (this.tokenManager.hasToken()) {
            this.tokenManager.getToken().then((token) => {
                if (token) {
                    this.headers.set('Authorization', 'Bearer ' + token);
                }
            })
        }
    }

    get(url: string = '', loadingMessage: string = 'Aguarde...') {

        let loader = this.loading.create({
            content: loadingMessage
        });

        loader.present();

        let options = new RequestOptions({headers: this.headers});

        return this.http.get(API_URL + url,
            options).map((res: Response) => {
                loader.dismiss();
                return res.json()
        });
    }

    post(url: string = '', payload: object = {}, loadingMessage: string = 'Aguarde...') {

        let loader = this.loading.create({
            content: loadingMessage
        });
        loader.present();

        let options = new RequestOptions({headers: this.headers});

        return this.http.post(API_URL + url,
            payload,
            options).toPromise().then((res: any) => {
            loader.dismiss();
            return this.extractData(res);
        }).catch(this.handleErrorObservable);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

}
