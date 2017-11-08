import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationDetailPage } from './station-detail';
import { ReservoirLevelModule } from '../../components/reservoir-level/reservoir-level.module';

@NgModule({
  declarations: [
    StationDetailPage
  ],
  imports: [
    IonicPageModule.forChild(StationDetailPage),
    ReservoirLevelModule
  ]
})
export class StationDetailPageModule {}
