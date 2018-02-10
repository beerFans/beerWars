import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
// import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../../app/graphql';
import { TableService } from '../../services/table.service';
import { UserService } from '../../services/user.service';

import { Table, User } from '../../app/types'
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';


import {Subscription} from 'rxjs/Subscription';

import { TABLE_QUERY, TableQueryResponse, UPDATE_USER_TABLE_SUBSCRIPTION } from '../../app/graphql';

import { AlertController } from 'ionic-angular';



declare var cordova: any;



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
  imageChosen: any = 0;
  imagePath: any;
  imageNewPath: any;

  subscriptions: Subscription[] = [];

  public loading = true;

  


  constructor(private camera: Camera, private apollo: Apollo, public navCtrl: NavController,private ts:TableService, private userService: UserService, private qrScanner: QRScanner, private alertCtrl: AlertController) {
    this.userService.getUser().then((user)=>{
      this.user = user;
      if(user){
        this.userService.isJoined(user.id).then((joined) => {
          this.joined = joined;
          this.loading = false;
          if(joined) {
            this.userService.getUserTable().then((table) => {
              console.log(table);
              this.table = table;
              this.realTimeSubscribe();
            })
          }
        })
      }
    });
  }

  joinTable(qr) {
    this.ts.getTableByQR(qr).then((table) => {
      console.log(table);
      this.table = table;
      this.joined = true;
      this.ts.updateTable(this.table.id);
      this.realTimeSubscribe();
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

  realTimeSubscribe() {
    const TableQuery = this.apollo.watchQuery<TableQueryResponse>({
      query: TABLE_QUERY,
      variables: {
        id: this.table.id
      },
    });
    console.log("Subscribing to updates on table: "+this.table.id);

    TableQuery.subscribeToMore({
      document: UPDATE_USER_TABLE_SUBSCRIPTION,
      variables: {
        tableId: this.table.id
      },
      updateQuery: (previous: TableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table.node) {
          console.log("cambio en mesa");
            let newTable = (<any>subscriptionData).data.Table.node;
          return {
            ...previous,
            Table: newTable
          }
        }
        else {
          return {
            ...previous,
            Table: this.table
          }
        }
      }
    });

    const querySubscription = TableQuery.valueChanges.subscribe((response) => {
      console.log('response');
      console.log(response);
      // if(response.data.table) {
        this.table = response.data.Table;
      // }
    });

    this.subscriptions = [...this.subscriptions, querySubscription];

  }

  changeName() {
      let alert = this.alertCtrl.create({
        title: 'Cambiar Nombre de la mesa',
        inputs: [
          {
            name: 'tableName',
            placeholder: 'Escribe aqui el nuevo nombre'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Guardar',
            handler: data => {
              this.ts.changeName(this.table.id, data.tableName);
            }
          }
        ]
      });
      alert.present();
    
  }

  changePicture() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 500,
      targetHeight: 500
    }
    
    this.camera.getPicture(options).then((imgUrl) => {
      
      console.log(imgUrl);

      let base64Image = 'data:image/jpeg;base64,' + imgUrl;

      this.ts.changePicture(this.table.id, base64Image);


    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  exitTable() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar salida',
      message: 'Seguro que deseas salir de la mesa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Buy clicked');
            this.ts.exitTable(this.table.id).then((data) => {
              if(data) {
                this.table = null;
                this.joined = false;
              }
            });
          }
        }
      ]
    });
    alert.present();
  }





}
