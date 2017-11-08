import { Component, OnInit } from '@angular/core';
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
export class LoginPage implements OnInit {

    form: any = {email: '', password: ''};

    showTouchIdButton: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController,
                private auth: AuthProvider, private api: ApiProvider, private logger: LoggerProvider, public platform: Platform,
                private touchId: TouchID, private alertCtrl: AlertController, private fb: Facebook) {
    }

    login(res? : any) {

        let loader = this.loading.create({
            content: 'Aguarde...'
        });

        let email = res ? res.email : this.form.email;
        let password = res ? res.password : this.form.password;

        loader.present();
        this.api.login(email, password).then(
            (response: any) => {
                this.auth.setToken(response.access_token, response.expires_in + Date.now());
                this.navCtrl.setRoot(HomePage);
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

        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit', this.auth.getToken());
        if (this.auth.getToken()) {
            this.navCtrl.setRoot(HomePage);
        }
    }

    ngOnInit() {
        if (this.platform.is('cordova')) {
            this.touchId.isAvailable().then(() => {
                this.showTouchIdButton = true;
            });
        }
    }
}
