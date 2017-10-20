import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationDetailPage } from './station-detail';

@NgModule({
  declarations: [
    StationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(StationDetailPage),
  ],
})
export class StationDetailPageModule {}
