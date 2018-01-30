import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { TableService } from '../../services/table.service';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION,NEW_TABLE_SUBSCRIPTION, CreateTableMutationResponse } from '../../app/graphql';
import {Subscription} from 'rxjs/Subscription';




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
  subscriptions: Subscription[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private ts: TableService, private apollo: Apollo) {

  }



  ionViewDidLoad() {
    this.ts.getTables().then((response) => {
      let bar = <any>{response};
      console.log(bar);
      this.allTables = bar.response.data.allTables;
      this.loading = false;
    });
    
    const allTablesQuery: any = this.apollo.watchQuery({
      query: ALL_TABLES_QUERY
    });

    allTablesQuery.subscribeToMore({
        document: NEW_TABLE_SUBSCRIPTION,
        updateQuery: (previous, { subscriptionData }) => {
          const newAllTables = [
            subscriptionData.Table.node,
            ...previous.allLinks
          ];
          return {
            ...previous,
            allTables: newAllTables
          }
        }
      });

    const querySubscription = allTablesQuery.valueChanges.subscribe((response) => {
      this.allTables = response.data.allTables;
      this.loading = response.data.loading;
    });

    this.subscriptions = [...this.subscriptions, querySubscription];
  }

  goToTable(table) {
    this.navCtrl.push('TablePage', {'table': table});
  }

}
