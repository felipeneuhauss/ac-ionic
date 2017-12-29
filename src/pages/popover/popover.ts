import { Component, OnInit } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TouchID } from '@ionic-native/touch-id';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { ApiProvider } from '../../providers/api/api';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TokenManagerProvider } from '../../providers/token-manager/token-manager';
import { USER_TYPE } from '../../providers/auth/auth';

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
export class PopoverPage implements OnInit {

  event: Event;

  showTouchIdOption: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private touchId: TouchID, private uniqueDeviceID: UniqueDeviceID,
              private alertCtrl: AlertController, private api: ApiProvider,
              private storage: LocalStorageProvider, private tokenManager: TokenManagerProvider) {
  }

  ngOnInit() {
      this.touchId.isAvailable()
          .then((res) => {
                this.showTouchIdOption = true;
            },(err) => {
              this.showTouchIdOption = true;
            }
          );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  registerTouchID() {

      this.touchId.verifyFingerprint('Salvar seu Touch ID').then(
          (res) => {
              this.uniqueDeviceID.get()
                  .then((uuid: any) => {
                      this.api.post('register-touch-id',
                          {username: this.storage.get('username'), unique_token: uuid}).then(
                          (res) => {
                              console.log('Ok, finger print saved', res);
                              this.storage.set('user_type', USER_TYPE.TOUCH_ID_USER);
                              if (res.success) {
                                  const alert = this.alertCtrl.create({
                                      title: 'Sucesso!',
                                      subTitle: 'Touch ID vinculado com sucesso!',
                                      buttons: ['OK']
                                  });
                                  alert.present();
                                  this.storage.set('hasTouchId', true);
                                  this.close();
                              } else {
                                  const alert = this.alertCtrl.create({
                                      title: 'Ops!',
                                      subTitle: 'Tivemos problemas em vincular seu Touch ID!',
                                      buttons: ['OK']
                                  });
                                  alert.present();
                              }
                          });
                  })
                  .catch((error: any) =>
                      console.log(error)
                  );

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
    this.tokenManager.destroyToken();
    this.navCtrl.setRoot(LoginPage);
  }

  close() {
      this.viewCtrl.dismiss();
  }

}
