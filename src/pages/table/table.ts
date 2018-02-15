import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { Subscription } from 'rxjs/Subscription';
import { TABLE_QUERY, UPDATE_USER_TABLE_SUBSCRIPTION, TableQueryResponse } from '../../app/graphql';
import { Apollo } from 'apollo-angular';
import { TableService } from '../../services/table.service';


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
  providers: [TableService],

})
export class TablePage {

  table : Table;
  subscriptions: Subscription[] = [];


  constructor(public apollo: Apollo, public navCtrl: NavController, public navParams: NavParams) {
    this.table = this.navParams.get('table');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablePage');
    this.realTimeSubscribe();
    
  }

  realTimeSubscribe() {
    const TableQuery = this.apollo.watchQuery<TableQueryResponse>({
      query: TABLE_QUERY,
      variables: {
        id: this.table.id
      },
    });
    console.log("Subscribing to updates on table: "+this.table.id);

    TableQuery.subscribeToMore({
      document: UPDATE_USER_TABLE_SUBSCRIPTION,
      variables: {
        tableId: this.table.id
      },
      updateQuery: (previous: TableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table.node) {
          console.log("cambio en mesa");
            let newTable = (<any>subscriptionData).data.Table.node;
          return {
            ...previous,
            Table: newTable
          }
        }
        else {
          return {
            ...previous,
            Table: this.table
          }
        }
      }
    });

    const querySubscription = TableQuery.valueChanges.subscribe((response) => {
      console.log('response');
      console.log(response);
      // if(response.data.table) {
        this.table = response.data.Table;
      // }
    });

    this.subscriptions = [...this.subscriptions, querySubscription];

  }

}
