import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RankingPage } from './ranking';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    RankingPage,
  ],
  imports: [
    IonicPageModule.forChild(RankingPage),
    PipesModule
  ],
  exports: [
    RankingPage
  ]
})
export class RankingPageModule {}
