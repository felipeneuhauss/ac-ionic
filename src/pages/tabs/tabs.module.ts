import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { HomePageModule } from '../home/home.module';
import { StationDetailPageModule } from '../station-detail/station-detail.module';
import { LoginPageModule } from '../login/login.module';
import { PopoverPageModule } from '../popover/popover.module';

@NgModule({
  declarations: [
    TabsPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    HomePageModule,
    StationDetailPageModule,
    LoginPageModule,
    PopoverPageModule
  ]
})
export class TabsPageModule {}
