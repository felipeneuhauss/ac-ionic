import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { SignUpPage } from '../sign-up/sign-up';
import { SignUpPageModule } from '../sign-up/sign-up.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    SignUpPageModule,
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
