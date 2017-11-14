import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthProvider} from "../auth/auth";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';
import {LoadingController} from "ionic-angular";
import {LocalStorageProvider} from "../local-storage/local-storage";

/*
 Generated class for the ApiProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class ApiProvider {

    // public static baseUrl: string = 'http://ac-api.app/';
    public static baseUrl: string = 'http://api.aguacinza.eco.br/';

    // public static apiUrl: string = 'http://ac-api.app/api/';
    public static apiUrl: string = 'http://api.aguacinza.eco.br/api/';

    private headers: Headers = new Headers();

    constructor(private http: Http,
                private auth: AuthProvider, public loading: LoadingController,
    private storage: LocalStorageProvider) {

    }

    get(url: string = '', loadingMessage: string = 'Aguarde...') {

        this.setAuthorization();

        let loader = this.loading.create({
            content: loadingMessage
        });

        loader.present();

        let options = new RequestOptions({headers: this.headers});

        return this.http.get(ApiProvider.apiUrl + url,
            options).map((res: Response) => {
                loader.dismiss();
                return res.json()
        });
    }

    post(url: string = '', payload: object = {}, loadingMessage: string = 'Aguarde...') {

        this.setAuthorization();

        let loader = this.loading.create({
            content: loadingMessage
        });
        loader.present();

        let options = new RequestOptions({headers: this.headers});

        return this.http.post(ApiProvider.apiUrl + url,
            payload,
            options).toPromise().then((res: any) => {
            loader.dismiss();
            return this.extractData(res);
        }).catch(this.handleErrorObservable);
    }

    login(username?: string, password?:string , uniqueToken?:string) {
        let payload: any = {
            client_id: 2,
            client_secret: 'czwwexj9iSEgvVjnB4p9nuYhzxSUQfG8DumThjUN',
            grant_type: 'custom_request'
        };

        if (username && password) {
            payload.username = username;
            payload.password = password;
        }

        if (uniqueToken) {
            payload.unique_token = uniqueToken;
        }

        this.storage.set('user', payload);

        return this.http.post(ApiProvider.baseUrl + 'oauth/token', payload)
            .toPromise().then((res) => {
                return this.extractLoginData(res);
            }).catch(this.handleErrorObservable);
    }

    register(payload) {
        return this.http.post(ApiProvider.baseUrl + '/api/register-user', payload)
            .map((response: any) => {
                return response.json();
            });
    }

    extractLoginData(res) {
        res = this.extractData(res);
        this.auth.setToken(res.access_token, res.expires_in + Date.now());
        return this.auth.hasToken();
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    private setAuthorization() {
        if (this.auth.hasToken() && this.auth.getToken()) {
            this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        }
    }
}
