import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth/auth';
import { TouchID } from '@ionic-native/touch-id';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  event: Event

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private auth: AuthProvider, public viewCtrl: ViewController,
              private touchId: TouchID, private uniqueDeviceID: UniqueDeviceID,
              private alertCtrl: AlertController, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  registerTouchID() {

      this.touchId.verifyFingerprint('Salvar seu Touch ID').then(
          (res) => {
              this.uniqueDeviceID.get()
                  .then((uuid: any) => {
                      console.log('uuid', uuid)
                      this.api.post('register-touch-id',
                          {username: this.auth.user().username, touch_id: uuid}).then(
                          (res) => {
                              console.log('Ok, finger print saved');
                              const alert = this.alertCtrl.create({
                                  title: 'Sucesso!',
                                  subTitle: 'Touch ID vinculado com sucesso!',
                                  buttons: ['OK']
                              });
                              alert.present();
                          });
                  })
                  .catch((error: any) => console.log(error));

          },
          (err) => {
              localStorage.setItem('touchId', err);
              console.error('Error', err);
              const alert = this.alertCtrl.create({
                  title: 'Ops!',
                  subTitle: err + 'Problemas ao vincular o Touch ID',
                  buttons: ['OK']
              });
              alert.present();
          }
      );
  }

  logout() {
    this.close();
    this.auth.destroyToken();
    this.navCtrl.setRoot(LoginPage);
  }

  close() {
      this.viewCtrl.dismiss();
  }

}