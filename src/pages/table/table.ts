import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'

/**
 * Generated class for the TablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {

  table : Table[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.table = this.navParams.get('table');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablePage');
  }

}
