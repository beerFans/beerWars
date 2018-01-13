import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse, USER_TABLE_QUERY } from '../app/graphql';
import { Events } from 'ionic-angular';


@Injectable()
export class TableService {

  constructor(private apollo: Apollo, private storage: Storage, private events: Events) {

  }

  getTableByQR(QRId) {
    return new Promise((resolve, reject) => {
      this.apollo.watchQuery<any>({
        query: TABLE_QR_QUERY,
        variables: {
          qrID: QRId,
        },
      }).valueChanges.subscribe((response) => {
        // 5
        console.log(response);

        if (response.data.table) {
          this.storage.set('joined', true);
          this.storage.set('table', response.data.table);
          this.events.publish('user:joined');
          resolve(response.data.table);
        }
        else {
          this.apollo.mutate({
            mutation: CREATE_TABLE_MUTATION,
            variables: {
              QRId: QRId,
            },
            // update: (store, { data: { createTable } }) => {
            //   const data: any = store.readQuery({
            //     query: ALL_TABLES_QUERY
            //   });
            //
            //   data.allTables.push(createTable);
            //   store.writeQuery({ query: ALL_TABLES_QUERY, data });
            //
            // },
          }).subscribe((response) => {
            console.log(response);
            this.storage.set('joined', true);
            this.storage.set('table', response.data.createTable);
            this.events.publish('user:joined');
            resolve(response.data.createTable);
            // We injected the Router service
            // this.router.navigate(['/']);
          });
        }
      });
    });
  }

  getTable() {
    return this.storage.get('table').then((value) => {
      //mirarrrrrrrrrrrrr
      return value;
    })
  }

}