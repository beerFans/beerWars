import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../../app/graphql';
import { TableService } from '../../services/table.service';
import { Table } from '../../app/types'
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  // providers: [TableService, QRScanner],
  providers: [TableService],
})
export class HomePage {

  public table: Table;

  constructor(private apollo: Apollo, public navCtrl: NavController, private ts: TableService) {

  }





  joinTable() {
    //Scan QR, me devuelve un id
    let QR = this.scanQR(); //Solo para probar, seria el que me devuelve el QR
    //Si no existe mesa con dicho id de qr, la creo (?)

    // this.ts.getTableByQR(QR).then((table) => {
    //   console.log(table);
    //   this.table = table;
    //   console.log(this.table.beerCount);
    // });

  }

  scanQR() { //Esto deberia encargarse de escanear el codigo y retornar el id
    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       // camera permission was granted
    //
    //       let toRet;
    //       // start scanning
    //       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         console.log('Scanned something', text);
    //
    //         toRet = text;
    //         this.qrScanner.hide(); // hide camera preview
    //         scanSub.unsubscribe(); // stop scanning
    //       });
    //
    //       // show camera preview
    //       this.qrScanner.show();
    //
    //       // wait for user to scan something, then the observable callback will be called
    //       return toRet;
    //     } else if (status.denied) {
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //     } else {
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     }
    //   })
    //   .catch((e: any) => console.log('Error is', e));
    return 'cjc6rtajgn9dx0173uusnyhto';
  }





}
