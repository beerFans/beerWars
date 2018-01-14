import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import { Events } from 'ionic-angular';

import { Table } from '../app/types'
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION, CreateTableMutationResponse } from '../app/graphql';


@Injectable()
export class TableService {

  constructor(private apollo: Apollo, private storage: Storage, private events: Events) {

  }

  getTables() {
    return new Promise((resolve,reject) => {
      console.log("Buscando mesas");
      this.apollo.watchQuery<any>({
        query: ALL_TABLES_QUERY
      }).valueChanges.subscribe((response) => {
        console.log(response.data.allTables);
        resolve(response);
      });
    });
  }

  getTableByQR(QRId) {
    return new Promise((resolve, reject) => {
      console.log('Buscando Mesa ' + QRId);
      this.apollo.watchQuery<any>({
        query: TABLE_QR_QUERY,
        variables: {
          qrID: QRId,
        },
      }).valueChanges.subscribe((response) => {
        // 5
        let table = response.data.Table;
        console.log('response');
        console.log(response);

        if (table) {
          this.joinTable(table.id, 'cjcdncsmbofde0149u2xjnk8c'); //user.service.getUser().then((user) => { this.joinTable(table.id, user.id) })
          this.storage.set('joined', true);
          this.storage.set('table', table);
          this.events.publish('user:joined');
          console.log('Ya existia la mesa, uniendose');
          console.log('fin unirse a mesa existente');
          resolve(table);
        }
        else {
          console.log('No existia mesa, creando mesa');
          this.apollo.mutate({
            mutation: CREATE_TABLE_MUTATION,
            variables: {
              QRId: QRId,
            },
            refetchQueries: ['TableQRQuery','AllTablesQuery']
          }).subscribe((response) => {
            console.log('Mesa creada');
            let table = response.data.createTable;
            this.joinTable(table.id, 'cjcb6ro4u2gfe0186nwwg3ev4');
            this.storage.set('joined', true);
            this.storage.set('table', table);
            this.events.publish('user:joined');
            console.log('Fin union a mesa creada');
            resolve(table);
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


  joinTable(tableId, userId) {
    this.apollo.mutate({
      mutation: JOIN_TABLE_MUTATION,
      variables: {
        userId: userId,
        tableId: tableId,
    }
    }).subscribe((response) => {
      console.log('Agregado usuario a mesa');
      console.log(response);
      console.log('fin agregar usuario0');
    })
  }
}
