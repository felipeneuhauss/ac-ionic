import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { AuthProvider } from "../providers/auth/auth";
import { TouchID } from '@ionic-native/touch-id';
import { ApiProvider } from '../providers/api/api';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
// import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  touchAvailable : boolean = false;

  pages: Array<{title: string, component: any}>;

  touchIdResponse: any;

  constructor(public platform: Platform, public statusBar: StatusBar, private touchId: TouchID,
              public splashScreen: SplashScreen, private auth : AuthProvider, private api: ApiProvider,
              private alertCtrl: AlertController, private uniqueDeviceID: UniqueDeviceID
              // private oneSignal: OneSignal
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Condomínios', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.touchId.isAvailable()
          .then(
              (res) => {
                  this.touchAvailable = true;
                  console.log('TouchID is available!', res);
              },(err) => {
                  this.touchAvailable = false;
                  console.error('TouchID is not available', err);
              }
          );

      // this.oneSignal.startInit("caf4c3c6-4b53-4f5b-93c3-410c868481d6", "167004169647");
      //
      // this.oneSignal.handleNotificationReceived().subscribe(() => {
      //  // do something when notification is received
      // });
      //
      // this.oneSignal.endInit();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.auth.destroyToken();
    this.nav.setRoot(LoginPage);
  }
  
  ngOnInit() {
    console.log('initializeApp', this.touchAvailable)
  }

  ngAfterViewInit() {
    if (!this.auth.getToken()) {
      this.nav.push(LoginPage);
    }
  }

  saveTouchId() {

    this.touchId.verifyFingerprint('Salvar seu Touch ID').then(
        (res) => {
            console.log(res);
            this.touchIdResponse = res;
            this.uniqueDeviceID.get()
                .then((uuid: any) => {
                    console.log('uuid', uuid)
                    this.api.post('users/touch-id',
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
            this.touchIdResponse = err;
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
}
