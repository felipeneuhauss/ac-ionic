import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TokenManagerProvider } from '../../providers/token-manager/token-manager';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = AboutPage;
  // tab3Root = ContactPage;

  constructor(private navCtrl: NavController, private tokenManager: TokenManagerProvider) {

  }

  logout() {
    this.tokenManager.destroyToken();
    this.navCtrl.setRoot(LoginPage);
  }
}
