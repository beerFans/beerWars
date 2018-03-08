import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankingPage } from '../ranking/ranking';
import { ProfilePage } from '../profile/profile';
import { WinnersPage } from '../winners/winners';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = HomePage
  rankingRoot = RankingPage
  profileRoot = ProfilePage
  winnersRoot = WinnersPage


  constructor(public navCtrl: NavController) {}

}
