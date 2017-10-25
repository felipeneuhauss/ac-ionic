import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,
         LoadingController, Platform} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";
import {LoggerProvider} from "../../providers/logger/logger";
import {SignUpPage} from "../sign-up/sign-up";
import {TouchID} from "@ionic-native/touch-id";

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

  form : any = {email: '', password: ''};

  showTouchIdButton: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController,
  private auth: AuthProvider, private api: ApiProvider, private logger: LoggerProvider, public platform: Platform,
              private touchId : TouchID, private alertCtrl: AlertController) {}

  login() {
    let loader = this.loading.create({
      content: 'Aguarde...'
    });
    loader.present();
    this.api.login(this.form.email, this.form.password).then(
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

  ngOnInit () {
     if (this.platform.is('cordova')) {
        this.touchId.isAvailable().then(() => {
           this.showTouchIdButton = true;
        });
     }
  }
}
