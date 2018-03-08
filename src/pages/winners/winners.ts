import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TableService } from '../../services/table.service';
import { WinnerTable, Table } from '../../app/types'


@Component({
  selector: 'page-winners',
  templateUrl: 'winners.html',
  providers: [TableService]
})
export class WinnersPage {

  public winnerTables: WinnerTable[] = [];

  constructor(private ts: TableService, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewWillEnter() {
    this.ts.getWinners().then((res) => {
      let bar = <any>{ res };
      console.log(bar);
      this.winnerTables = bar.res.data.allWinnerTables;
    })
  }

  goToTable(table) {
    this.navCtrl.push('TablePage', { 'table': table, 'from': 'winners' });
  }

}
