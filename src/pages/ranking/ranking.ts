import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { TableService } from '../../services/table.service';
import { Apollo } from 'apollo-angular';
import { ALL_TABLES_QUERY, NEW_TABLE_SUBSCRIPTION, 
  DELETE_TABLE_SUBSCRIPTION,UPDATE_TABLE_SUBSCRIPTION,AllTableQueryResponse } from '../../app/graphql';
import {Subscription} from 'rxjs/Subscription';



/**
 * Generated class for the RankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
  providers: [TableService],
})
export class RankingPage {
  public allTables: Table[] = [];
  public loading: boolean = true;
  shownTable: Table;
  subscriptions: Subscription[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private ts: TableService, private apollo: Apollo) {


  }



  ionViewDidLoad() {
    this.ts.getTables().then((response) => {
      let bar = <any>{ response };
      // console.log(bar);
      this.allTables = bar.response.data.allTables;
      this.loading = false;
    });

    const allTablesQuery = this.apollo.watchQuery<AllTableQueryResponse>({
      query: ALL_TABLES_QUERY
    });

    allTablesQuery.subscribeToMore({
      document: NEW_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("hay nueva mesa");
          let newAllTables = [
            (<any>subscriptionData).data.Table.node,
            ...previous.allTables
            ];
            newAllTables = this.sort(newAllTables);
          return {
            ...previous,
            allTables: newAllTables
          }
        }
        else {
          return {
            ...previous
          }
        }
      }
    });

    allTablesQuery.subscribeToMore({
      document: UPDATE_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("mesa modificada");
          let newAllTables = [
            ...previous.allTables
          ]
          newAllTables = this.sort(newAllTables);
          return {
            ...previous,
            allTables: newAllTables
          }
        }
        else {
          return {
            ...previous
          }
        }
      }
    });

    allTablesQuery.subscribeToMore({
      document: DELETE_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("mesa eliminada", (<any>subscriptionData).data);
          let index = this.allTables.findIndex(x=> x.id === (<any>subscriptionData).data.Table.previousValues.id)
          let newAllTables = [...this.allTables];
          console.log("index", index);
          if(index !== -1){
            newAllTables.splice(index,1);
          }
          console.log("New all tables",newAllTables);
          return {
            ...previous,
            allTables: newAllTables
          }
        }
        else {
          return {
            ...previous
          }
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
  this.navCtrl.push('TablePage', { 'table': table });
}

sort(tables) {
  tables.sort(function(a,b) {
    if(a['beerCount'] > b['beerCount']) {
      return -1;
    }
    else if(a['beerCount'] < b['beerCount']) {
      return 1;
    }
    else {
      return 0;
    }
  });
  return tables;
}

// vista() {
//   $('.panel').click(function() {
//     if(!$(this).hasClass('active')) {
//       var index = $(this).index();
//       $('#order').removeClass();
//       $('#order').addClass('opt'+(index+1));
//       $('#choice').get(0).selectedIndex = index;
//       $(this).siblings().addClass('hidden');
//       $(this).addClass('active');
//       $('#order').delay(800).slideToggle(400);
//     }
//   });
  
//   $('#back').click(function(e) {
//     $('#order').slideToggle(400);
//     var self = this;
//     setTimeout(function() {
//       $('.panel').removeClass('hidden active');
//     }, 400);
//     e.preventDefault();
//   });
  
//   $('#submit').click(function(e) {
//     e.preventDefault();
//   });
  
//   $('#quantity').on('input change', function() {
//     var qv = $('#quantity').val();
//     if(qv % 1 != 0) {
//       qv = parseInt(qv, 10);
//       if(qv == 0) qv = "";
//       qv += "½";
//     }
//     $('label[for="quantity"]').text(qv);
//     // TODO: update the price as well
//   })
// }

panelClick(e) {
  console.log(e);
  let div = e.target
  if(!div.classList.contains('active')) {
    // var index = div.index();
    // document.getElementById('order').classList.remove();
    document.getElementById('order').classList.add('opt1');
    // document.getElementById('choice')[0].selectedIndex = index;
    
    let siblings = div.parentNode.children;
    console.log(siblings);
    for (var i = 0; i < siblings.length; i++) {
      if(siblings[i]!=div)
        siblings[i].classList.add('hidden');
    }
    div.classList.add('active');
    setTimeout(function(){document.getElementById("order").innerHTML="";}, 800);

  }
}


}
