import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {ApiProvider} from "../../providers/api/api";

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
              public loading: LoadingController, private api: ApiProvider,
              public alert: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUp() {
    let loader = this.loading.create({
      content: 'Aguarde...'
    });
    loader.present();

    let alertSuccess = this.alert.create({
      title: 'Sucesso',
      subTitle: 'Cadastro realizado com sucesso',
      buttons: ['Ok']
    });

    let errorSuccess = this.alert.create({
      title: 'Ops!',
      subTitle: 'Tivemos um problema. Isso não deveria ter acontecido.',
      buttons: ['Vixi...']
    });

    this.api.register(this.form).subscribe(
        (response: any) => {
          if (response.success) {
            loader.dismiss();
            alertSuccess.present();
            this.navCtrl.push(LoginPage);
          }
        }, (error: any) => {
          console.log('sign-up-error', error);
          loader.dismiss();
          errorSuccess.present();
        }
    )
  }

  backLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
