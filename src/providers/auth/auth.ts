import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LocalStorageProvider } from "../local-storage/local-storage";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { API_URL, ApiProvider, BASE_URL } from '../api/api';
import { LoadingController, AlertController } from 'ionic-angular';
import { TokenManagerProvider } from '../token-manager/token-manager';
import { TouchID } from '@ionic-native/touch-id';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

export enum USER_TYPE {
    NORMAL_USER,
    FACEBOOK_USER,
    TOUCH_ID_USER
}

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

    public static baseUrl: string = 'http://api.aguacinza.eco.br';

    constructor(public http: Http, private storage: LocalStorageProvider,
                private loading: LoadingController, private alert: AlertController,
                private fb: Facebook, private tokenManager: TokenManagerProvider,
                private uniqueDeviceID: UniqueDeviceID, private api: ApiProvider,
                private touchId: TouchID
                ) {
        console.log('Hello AuthProvider Provider');
    }


    login(username?: string, password?: string, uniqueToken?: string): Promise<any> {
        if (username) {
            this.storage.set('username', username);
        }

        let loader = this.loading.create({
            content: 'Aguarde...'
        });
        loader.present();

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

        return new Promise((resolve, reject) => {
            this.http.post(BASE_URL + 'oauth/token', payload)
            .toPromise().then((res) => {
                loader.dismiss();
                let auth = this.extractLoginData(res);
                console.log('user_auth', auth);
                if (auth.access_token) {
                    this.storage.set('user', auth);
                    resolve(auth);
                    return;
                }

                reject(null);
            }).catch((error) => {
                loader.dismiss();
                reject(error);
            });
        })
    }

    register(payload): Promise<any> {
        let loader = this.loading.create({
            content: 'Aguarde...'
        });
        loader.present();

        let alertSuccess = this.alert.create({
            title: 'Sucesso',
            subTitle: 'Cadastro realizado com sucesso',
            buttons: ['Ok']
        });

        let alertError = this.alert.create({
            title: 'Ops!',
            subTitle: 'Problemas ao registrar. Verifique se você já não está cadastrado.',
            buttons: ['Ok']
        });

        return new Promise((resolve, reject) => {
            this.http.post(API_URL + 'register-user', payload)
                .toPromise().then((response: any) => {
                loader.dismiss();
                alertSuccess.present();
                resolve(response.json());
            }, (error) => {
                alertError.present();
                loader.dismiss();
                reject(error);
            });
        });
    }

    defaultLogin(username: string, password: string): Promise<any> {

        this.storage.set('user_type', USER_TYPE.NORMAL_USER);

        return new Promise((resolve) => {
            resolve(this.login(username, password));
        })

    }

    touchIdLogin(): Promise<any> {

        this.storage.set('user_type', USER_TYPE.TOUCH_ID_USER);

        return new Promise((resolve, reject) => {
            this.touchId.verifyFingerprint('Desbloquear usando o Touch ID').then((res) => {
                this.uniqueDeviceID.get()
                    .then((uuid: any) => {
                        this.login(null, null, uuid).then((res) => {
                            resolve(res);
                        }, (error) => {
                            reject(error);
                        });
                    })
                    .catch((error: any) => {
                        const alert = this.alert.create({
                            title: 'Atenção',
                            subTitle: 'Não foi possível fazer o login com o Touch ID.',
                            buttons: ['Tudo bem']
                        });
                        alert.present();
                        console.log(error)
                        reject(error);
                    });
            });
        });
    }

    fbLogin(): Promise<any> {
        this.storage.set('user_type', USER_TYPE.FACEBOOK_USER);

        return new Promise((resolve, reject) => {

            this.fb.login(['public_profile', 'user_friends', 'email'])
                .then((res: FacebookLoginResponse) => {
                    if (res.status === "connected") {
                        let payload: any = {};

                        payload.provider = 'facebook';

                        this.fb.api('/me?fields=name,email', []).then((details)=> {
                            payload.email = details.email;
                            payload.name = details.name;
                            payload.provider_id = details.id;

                            this.api.post('register-social', payload).then((res) => {
                                this.login(res.email, res.password).then(
                                    (response: any) => {
                                        resolve(response);
                                    }, (error: any) => {
                                        reject(error);
                                    });

                            });
                        });
                    }
                })
                .catch(e => console.log('Error logging into Facebook', e));
        });
    }

    refreshFbLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fb.getLoginStatus().then((res: FacebookLoginResponse) => {
                if (res.status == 'connected') {
                    let payload: any = {};
                    payload.provider = 'facebook';

                    this.fb.api('/me?fields=name,email', []).then((details)=> {

                        payload.email = details.email;
                        payload.name = details.name;
                        payload.provider_id = details.id;

                        this.api.post('register-social', payload).then((res) => {
                            this.login(res.email, res.password).then(
                                (response: any) => {
                                    resolve(response);
                                }, (error: any) => {
                                    reject(error);
                                });

                        });

                    });
                }
            })
        });
    }

    private refreshTouchIdAuthentication(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.touchIdLogin().then((res) => {
                console.log('refreshTouchLogin', res);
                resolve(res);
            }, (error) => {
                reject(error);
            });
        })
    }

    private refreshFacebookAuthentication() {
        return new Promise((resolve, reject) => {
            this.refreshFbLogin().then((res) => {
                console.log('refreshTouchLogin', res);
                resolve(res);
            }, (error) => {
                reject(error);
            });
        })
    }

    extractLoginData(res) {
        res = this.extractData(res);
        this.tokenManager.setToken(res.access_token, res.expires_in + Date.now());
        return res;
    }

    isLogged(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.tokenManager.getToken().then((token) => {
                if (token) {
                    resolve(true);
                    return;
                }
                this.refreshToken().then((user?: string, password?: string, uuid?: string) => {
                    this.login(user, password, uuid).then((user: any) => {
                        resolve(user);
                    }, (error) => {
                        reject(error);
                    });
                });
            });
        });
    }

    refreshToken(): Promise<any> {


        let userType = this.storage.get('userType');
        console.log('userType', userType);

        if (!userType) {
            return;
        }

        if(userType === USER_TYPE.TOUCH_ID_USER) {
            return this.refreshTouchIdAuthentication();
        }

        if(userType === USER_TYPE.FACEBOOK_USER) {
            return this.refreshFacebookAuthentication();
        }

        return new Promise((resolve) => {
            resolve();
        });
    }

    user() {
        return this.storage.get('user');
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }


}
