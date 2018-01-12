import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION, CreateTableMutationResponse } from '../app/graphql';



@Injectable()
export class TableService {

  constructor(private apollo: Apollo) {

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
        let table = response.data.Table;

        if (table) {
          joinTable(table.id, 'cjcb6ro4u2gfe0186nwwg3ev4')
          resolve(table);
        }
        else {
          this.apollo.mutate({
            mutation: CREATE_TABLE_MUTATION,
            variables: {
              QRId: QRId,
            },
          }).subscribe((response) => {
            console.log(response);
            let table = response.data.createTable

            joinTable(table.id, 'cjcb6ro4u2gfe0186nwwg3ev4')
            resolve(response.data.table);
          });
        }
      });
    });
  }



  joinTable(tableId, userId) {
    this.apollo.mutate({
      mutation: JOIN_TABLE_MUTATION,
      variables: {
        userId: userId,
        tableId: tableId,
      }
    }).subscribe((response => {
      console.log('Agregado usuario a mesa');
      console.log(response);
      console.log('fin agregar usuario0');
    }))
  }
}
