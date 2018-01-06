import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, CreateTableMutationResponse } from '../../app/graphql';


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

  scanQR() { //Esto deberia encargarse de escanear el codigo y retornar el id
    return '1234';
  }

  joinTable() {
    //Scan QR, me devuelve un id
    this.QRId = scanQR(); //Solo para probar, seria el que me devuelve el QR
    //Si no existe mesa con dicho id de qr, la creo (?)
    if (!existeMesa(this.QRId)) {
      createTable(this.QRId);
    }
  }



  existeMesa(QRId) {
    return false;
  }

  createTable(QRId) {
    this.apollo.mutate({
      mutation: CREATE_TABLE_MUTATION,
      variables: {
        name: this.tableName,
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
      this.router.navigate(['/']);
    });
  }



}
