import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SignUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  name: 'sign-up-page'
})
@Component({
  selector: 'sign-up-page',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  form : any = {name : '', password: '', email: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loading: LoadingController, public alert: AlertController,
              private auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUp() {
    this.auth.register(this.form).subscribe(
        (response: any) => {
          if (response.success) {
            this.navCtrl.push(LoginPage);
          }
        }, (error: any) => {
          console.log('sign-up-error', error);
        }
    )
  }

  backLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
