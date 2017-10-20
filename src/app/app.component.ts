import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
import {LoginPage} from "../pages/login/login";
import {AuthProvider} from "../providers/auth/auth";
import { TouchID } from '@ionic-native/touch-id';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  touchAvailable : boolean;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, private touchId: TouchID,
              public splashScreen: SplashScreen, private auth : AuthProvider) {
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

  ngAfterViewInit() {
    if (!this.auth.getToken()) {
      this.nav.push(LoginPage);
    }
  }
}
