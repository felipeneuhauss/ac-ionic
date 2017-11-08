import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from "../pages/login/login";
import { AuthProvider } from "../providers/auth/auth";
import { TouchID } from '@ionic-native/touch-id';
import { OneSignal } from '@ionic-native/onesignal';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;

  touchAvailable : boolean = false;

  pages: Array<{title: string, component: any}>;

  touchIdResponse: any;

  constructor(public platform: Platform, public statusBar: StatusBar, private touchId: TouchID,
              public splashScreen: SplashScreen, private auth : AuthProvider,
              private oneSignal: OneSignal
  ) {

    if (!this.auth.getToken()) {
        this.rootPage = LoginPage;
        return;
    }
    this.initializeApp();
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

      if (this.platform.is('cordova')) {
         this.oneSignal.startInit("caf4c3c6-4b53-4f5b-93c3-410c868481d6", "167004169647");
        // //
         this.oneSignal.handleNotificationReceived().subscribe(() => {
        //   // do something when notification is received
         });
        //
         this.oneSignal.endInit();
      }
    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
  //
  // logout() {
  //   this.auth.destroyToken();
  //   this.navCtrl.setRoot(LoginPage);
  // }
  //
  // ngOnInit() {
  //   console.log('initializeApp', this.touchAvailable)
  // }
  //
  //

}
