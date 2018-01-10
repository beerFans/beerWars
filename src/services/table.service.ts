import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../app/graphql';



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

        if (response.data.Table) {
          //Agregar usuario a la mesa
          resolve(response.data.Table);
        }
        else {
          console.log('glsdasd');
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
