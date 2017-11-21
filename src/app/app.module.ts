import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { IonicImageLoader } from 'ionic-image-loader';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ApiProvider } from '../providers/api/api';
import { LoggerProvider } from '../providers/logger/logger';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { TouchID } from "@ionic-native/touch-id";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { OneSignal } from '@ionic-native/onesignal';
import { Facebook } from '@ionic-native/facebook';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { TokenManagerProvider } from '../providers/token-manager/token-manager';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''/*,
      backButtonItem: 'close'
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'*/
    }),
    IonicImageLoader.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider,
    AuthProvider,
    LoggerProvider,
    LocalStorageProvider,
    TouchID,
    UniqueDeviceID,
    OneSignal,
    Facebook,
    LaunchNavigator,
    TokenManagerProvider
  ]
})
export class AppModule {}
