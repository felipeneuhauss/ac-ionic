import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams,
    LoadingController, Platform, AlertController
} from 'ionic-angular';

import { AuthProvider, USER_TYPE } from "../../providers/auth/auth";

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
                private auth: AuthProvider,
                public platform: Platform, private touchId: TouchID, private tokenManager: TokenManagerProvider,
                private logger: LoggerProvider, private alert: AlertController,
                private storage: LocalStorageProvider) {
        console.log('constructor LoginPage');
    }

    login() {
        console.log('defaultLogin');
        this.auth.defaultLogin(this.form.email, this.form.password).then(
            (response: any) => {
                this.loginSucceeded(response);
            }, (error: any) => {
                this.loginFailed(error);
            });
    }

    fbLogin() {
        console.log('fbLogin');
        this.auth.fbLogin().then(
            (response: any) => {
                this.loginSucceeded(response);
            }, (error: any) => {
                this.loginFailed(error);
            });
    }

    touchIdLogin() {
        if (this.storage.get('user_type') == USER_TYPE.TOUCH_ID_USER) {

            this.auth.touchIdLogin().then((res) => {
                console.log('touchIdLogin', res);
                this.loginSucceeded(res);
            }, (error) => {
                this.loginFailed(error);
            });

            return;
        }
        const alert = this.alert.create({
            title: 'Atenção',
            subTitle: 'Faça o login e ative o Touch ID no menu da tela principal.',
            buttons: ['Ok.']
        });
        alert.present();
    }

    signUpPage() {
        this.navCtrl.setRoot(SignUpPage);
    }

    ngAfterViewInit() {
        this.tokenManager.getToken().then((token) => {
            if (token) {
                this.navCtrl.setRoot(HomePage);
            }
        });

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
