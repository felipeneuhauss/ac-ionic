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
        this.setAuthorizationToken();
    }

    get(url: string = '', loadingMessage: string = 'Aguarde...') {

        let loader = this.loading.create({
            content: loadingMessage
        });

        loader.present();

        this.setAuthorizationToken();

        let options = new RequestOptions({headers: this.headers});

        return this.http.get(API_URL + url,
            options).map((res: Response) => {
                loader.dismiss();
                return res.json()
        }, (error) => {
            console.log('get-error', error);
            loader.dismiss();
        });
    }

    post(url: string = '', payload: object = {}, loadingMessage: string = 'Aguarde...') {

        let loader = this.loading.create({
            content: loadingMessage
        });
        loader.present();

        this.setAuthorizationToken();

        let options = new RequestOptions({headers: this.headers});

        return this.http.post(API_URL + url,
            payload,
            options).toPromise().then((res: any) => {
            loader.dismiss();
            return this.extractData(res);
        }, (error) => {
            loader.dismiss();
        }).catch((error) => {
            loader.dismiss();
        });
    }

    private setAuthorizationToken() {
        if (this.tokenManager.getStaticToken()) {
            this.headers.set('Authorization', 'Bearer ' + this.tokenManager.getStaticToken());
            console.log('Authorization', this.tokenManager.getStaticToken());
        }
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

}
