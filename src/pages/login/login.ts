import { Component } from '@angular/core';
import {
    IonicPage, NavController, NavParams, AlertController,
    LoadingController, Platform
} from 'ionic-angular';

import { AuthProvider } from "../../providers/auth/auth";
import { ApiProvider } from "../../providers/api/api";
import { LoggerProvider } from "../../providers/logger/logger";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { HomePage } from "../home/home";
import { SignUpPage } from "../sign-up/sign-up";
import { TouchID } from "@ionic-native/touch-id";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

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
                private auth: AuthProvider, private api: ApiProvider, private logger: LoggerProvider, public platform: Platform,
                private touchId: TouchID, private alertCtrl: AlertController, private fb: Facebook,
                private uniqueDeviceID: UniqueDeviceID, private storage: LocalStorageProvider) {
        console.log('constructor LoginPage');
    }

    login(res? : any) {

        let loader = this.loading.create({
            content: 'Aguarde...'
        });
        loader.present();

        let email = res ? res.email : this.form.email;
        let password = res ? res.password : this.form.password;

        this.api.login(email, password).then(
            (response: any) => {
                if (response) {
                    this.navCtrl.setRoot(HomePage);
                }
                loader.dismiss();
            }, (error: any) => {
                const alert = this.alertCtrl.create({
                    title: 'Atenção',
                    subTitle: 'Verifique seu usuário e senha. Pelo visto não estão corretos.',
                    buttons: ['Tudo bem']
                });
                alert.present();
                this.logger.error(error);
                loader.dismiss();
            });
    }

    fbLogin() {
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
                            this.login(res);
                        });
                    });

                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    signUpPage() {
        this.navCtrl.setRoot(SignUpPage);
    }

    signInWithTouchId() {
        this.touchId.verifyFingerprint('Desbloquear usando o Touch ID').then((res) => {
            let loader = this.loading.create({
                content: 'Aguarde...'
            });
            loader.present();
            this.uniqueDeviceID.get()
                .then((uuid: any) => {
                    console.log('uuid', uuid);
                    loader.dismiss();
                    this.api.login(null, null, uuid).then((res) => {
                        if (res) {
                            this.navCtrl.setRoot(HomePage);
                        }
                    });
                })
                .catch((error: any) => {
                    loader.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Atenção',
                        subTitle: 'Não foi possível fazer o login com o Touch ID.',
                        buttons: ['Tudo bem']
                    });
                    alert.present();
                    console.log(error)
                });
        });
    }

    ngAfterViewInit() {
        if (this.auth.getToken()) {
            this.navCtrl.setRoot(HomePage);
        }

        if (this.platform.is('cordova')) {
            this.touchId.isAvailable().then((res) => {
                console.log('Touch ID available');
                this.showTouchIdButton = true;
                if (this.storage.get('hasTouchId')) {
                    this.signInWithTouchId();
                }
            }, (err) =>{
                console.log('Touch ID is not available');
                this.showTouchIdButton = false;
            });
        }
    }

}
