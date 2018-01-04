import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import { ALL_LINKS_QUERY, AllLinkQueryResponse } from '../../app/graphql';
import { Link } from '../../app/types';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  allLinks: Link[] = [];
  loading: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apollo: Apollo) {
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
    //
    // // Let's populate this page with some filler content for funzies
    // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];
    //
    // this.items = [];
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }

  }

  ngOnInit() {

    // 4
    this.apollo.watchQuery<any>({
      query: ALL_LINKS_QUERY
    }).valueChanges.subscribe((response) => {
      // 5
      console.log(JSON.stringify(response));

      this.allLinks = response.data.allLinks;
      this.loading = response.data.loading;
    });

  }


  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
