import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams,
    LoadingController, Platform, AlertController
} from 'ionic-angular';

import { AuthProvider, USER_TYPE } from "../../providers/auth/auth";
import { ApiProvider } from "../../providers/api/api";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { HomePage } from "../home/home";
import { SignUpPage } from "../sign-up/sign-up";
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TokenManagerProvider } from '../../providers/token-manager/token-manager';
import { TouchID } from '@ionic-native/touch-id';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
    name: 'login'
})
@Component({
    templateUrl: 'login.html',
    selector: 'page-login'
})
export class LoginPage {

    form: any = {email: '', password: ''};

    public showTouchIdButton: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController,
                private auth: AuthProvider, private api: ApiProvider,
                public platform: Platform, private touchId: TouchID,
                private fb: Facebook, private tokenManager: TokenManagerProvider,
                private logger: LoggerProvider, private alert: AlertController,
                private storage: LocalStorageProvider) {
        console.log('constructor LoginPage');
    }

    login(res? : any) {
        this.auth.defaultLogin(this.form.email, this.form.password).then(
            (response: any) => {
                this.loginSucceeded(response);
            }, (error: any) => {
                this.loginFailed(error);
            });
    }

    fbLogin() {
        this.storage.set('user_type', USER_TYPE.FACEBOOK_USER);

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
                            this.auth.login(res.email, res.password).then(
                                (response: any) => {
                                    this.loginSucceeded(response);
                                }, (error: any) => {
                                    this.loginFailed(error);
                                });

                        });
                    });

                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    touchIdLogin() {
        this.auth.touchIdLogin().then((res) => {
            console.log('touchIdLogin', res);
            this.loginSucceeded(res);
        }, (error) => {
            this.loginFailed(error);
        });
    }

    signUpPage() {
        this.navCtrl.setRoot(SignUpPage);
    }

    ngAfterViewInit() {
        this.tokenManager.getToken().then((token) => {
            console.log('token', token)
            if (token) {
                this.navCtrl.setRoot(HomePage);
            }
        })

        if (this.platform.is('cordova')) {
            this.touchId.isAvailable().then((res) => {
                console.log('Touch ID available');
                this.showTouchIdButton = true;
                if (this.storage.get('hasTouchId')) {
                    this.touchIdLogin();
                }
            }, (err) =>{
                console.log('Touch ID is not available');
                this.showTouchIdButton = false;
            });
        }
    }

    loginSucceeded(response) {
        if (response) {
            this.navCtrl.setRoot(HomePage);
        }
    }

    loginFailed(error: any) {
        const alert = this.alert.create({
            title: 'Atenção',
            subTitle: 'Verifique seu usuário e senha. Pelo visto não estão corretos.',
            buttons: ['Tudo bem']
        });
        alert.present();
        this.logger.error(error);
    }
}
