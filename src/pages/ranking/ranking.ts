import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { TableService } from '../../services/table.service';


/**
 * Generated class for the RankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
  providers: [TableService],
})
export class RankingPage {
  public allTables: Table[];
  public loading: boolean = true;
  shownTable : Table;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ts: TableService) {

  }



  ionViewDidLoad() {
    this.ts.getTables().then((response) => {
      let bar = <any>{response};
      console.log(bar);
      this.allTables = bar.response.data.allTables;
      this.loading = false;
    });
  }

  goToTable(table) {
    this.navCtrl.push('TablePage', {'table': table});
  }

}
