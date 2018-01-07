import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QUERY, CreateTableMutationResponse } from '../../app/graphql';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  QRId: string = '';
  tableName = '';

  constructor(private apollo: Apollo, public navCtrl: NavController) {

  }

  ngOnInit() {
  }



  joinTable() {
    //Scan QR, me devuelve un id
    this.QRId = this.scanQR(); //Solo para probar, seria el que me devuelve el QR
    //Si no existe mesa con dicho id de qr, la creo (?)
    if (!this.existeMesa(this.QRId)) {
      console.log("No existe mesa");

      this.createTable(this.QRId);
    }
    else {
      console.log("Existe mesa");
    }
  }

  scanQR() { //Esto deberia encargarse de escanear el codigo y retornar el id
    return 'altoqr';
  }

  existeMesa(QRId) {
    var tableID = "";
    this.apollo.watchQuery<any>({
      query: TABLE_QUERY,
      variables: {
        qrID: QRId,
      },
    }).valueChanges.subscribe((response) => {
      // 5
      console.log(response);

      if (response.data.Table) {
        tableID = response.data.Table.id;
        console.log(tableID);
      }
    });
    return tableID;
  }

  createTable(QRId) {
    this.apollo.mutate({
      mutation: CREATE_TABLE_MUTATION,
      variables: {
        name: this.tableName,
        QRId: QRId,
      },
      update: (store, { data: { createTable } }) => {
        const data: any = store.readQuery({
          query: ALL_TABLES_QUERY
        });

        data.allTables.push(createTable);
        store.writeQuery({ query: ALL_TABLES_QUERY, data })
      },
    }).subscribe((response) => {
      // We injected the Router service
      // this.router.navigate(['/']);
    });
  }



}
