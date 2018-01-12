import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../../app/graphql';
import { TableService } from '../../services/table.service';
import { Table } from '../../app/types'
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TableService, QRScanner],
})
export class HomePage {

  public table: Table;
  public qrID;

  constructor(private apollo: Apollo, public navCtrl: NavController, private ts: TableService, private qrScanner: QRScanner) {

  }





  joinTable(qr) {


    this.ts.getTableByQR(qr).then((table) => {
      console.log(table);
      this.table = table;
    });

  }

  scanQR() {
    // return new Promise((resolve, reject) => {
      var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

      console.log('Preparando escaneo'); //Esto deberia encargarse de escanear el codigo y retornar el id
      this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {
            // camera permission was granted

            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              console.log('Scanned something', text);

              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning

              this.joinTable(text);
              ionApp.style.display = 'block';

            });

            // show camera preview
            ionApp.style.display = 'none';
            this.qrScanner.show();

            // wait for user to scan something, then the observable callback will be called
            // resolve(toRet);
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
          }
        })
        .catch((e: any) => console.log('Error is', e));
      // return 'cjc6rtajgn9dx0173uusnyhto';
    // });
}







}
