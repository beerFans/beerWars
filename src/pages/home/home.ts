import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../../app/graphql';
import { TableService } from '../../services/table.service';
import { UserService } from '../../services/user.service';

import { Table, User } from '../../app/types'
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TableService, QRScanner],
})
export class HomePage {

  public table : Table;
  public user: User;
  public joined;
  public qrID;

  constructor(private apollo: Apollo, public navCtrl: NavController,private ts:TableService, private userService: UserService, private qrScanner: QRScanner) {
    this.userService.getUser().then((user)=>{
      this.user = user;
      if(user){
        this.userService.isJoined(user.id).then((joined) => {
          this.joined = joined;
        })
      }
    });
  }

  joinTable(qr) {
    this.ts.getTableByQR(qr).then((table) => {
      console.log(table);
      this.table = table;
      this.joined = true;
    });
  }

  scanQR() {


    var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

    console.log('Preparando escaneo'); //Esto deberia encargarse de escanear el codigo y retornar el id
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {

            ionApp.style.display = 'block';
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

            this.joinTable(text);


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
  }

  



}
