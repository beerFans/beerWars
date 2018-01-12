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
          //Agregar usuario a la mesa
          this.apollo.mutate({
          mutation: JOIN_TABLE_MUTATION,
          variables: {
            userId: 'cjcb6ro4u2gfe0186nwwg3ev4',
            tableId: table.id,
          }
        }).subscribe((response => {
          console.log('Agregado usuario a mesa');
          console.log(response);
          console.log('fin agregar usuario0');
        }))
          resolve(table);
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
            resolve(response.data.createTable);
            // We injected the Router service
            // this.router.navigate(['/']);
          });
        }
      });
    });
  }
}
