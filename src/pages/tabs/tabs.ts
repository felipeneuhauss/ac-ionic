import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = AboutPage;
  // tab3Root = ContactPage;

  constructor(private auth: AuthProvider, private navCtrl: NavController) {

  }

  logout() {
    this.auth.destroyToken();
    this.navCtrl.setRoot(LoginPage);
  }
}
