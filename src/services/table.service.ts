import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import { Events } from 'ionic-angular';
import {UserService} from './user.service'

import { REMOVE_USER_FROM_TABLE_MUTATION, CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, 
        TABLE_QR_QUERY, JOIN_TABLE_MUTATION, FAKE_UPDATE_TABLE_MUTATION, UPDATE_TABLE_NAME_MUTATION, 
        UPDATE_TABLE_PICTURE_MUTATION, QR_QUERY, TableQRQueryResponse, ALL_WINNERS_QUERY } from '../app/graphql';


@Injectable()
export class TableService {
  public user;

  constructor(private apollo: Apollo, private storage: Storage, private events: Events, private us: UserService) {
    this.us.getUser().then((user) => {
      this.user = user;
    });

  }

  getTables() {
    return new Promise((resolve, reject) => {
      console.log("Buscando mesas");
      this.apollo.watchQuery<any>({
        query: ALL_TABLES_QUERY
      }).valueChanges.subscribe((response) => {
        resolve(response);
      });
    });
  }

  getWinners() {
    return new Promise((resolve, reject) => {
      console.log("Buscando mesas ganadoras");
      this.apollo.watchQuery<any>({
        query: ALL_WINNERS_QUERY
      }).valueChanges.subscribe((response) => {
        resolve(response);
      });
    });
  }

  createAndJoin(QRId) {
    return new Promise((resolve,reject)=> {
      this.validQR(QRId).then((res) => {
        console.log("res ",res);
        if(!res) {
          reject('QR Invalido');
        }
        else {
          console.log('No existia mesa, creando mesa');
          this.apollo.mutate({
            mutation: CREATE_TABLE_MUTATION,
            variables: {
              QRId: QRId,
              nro: res
            },
            refetchQueries: ['TableQRQuery', 'AllTablesQuery']
          }).subscribe((response) => {
            console.log('Mesa creada');
            let table = response.data.createTable;
            this.joinTable(table.id, this.user.id);
            this.storage.set('joined', true);
            this.storage.set('table', table);
            this.events.publish('user:joined');
            console.log('Fin union a mesa creada');
            resolve(table);
          });
        }
      }); 
    })
    
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
          resolve (table);

            // this.joinTable(table.id, this.user.id);
            // this.storage.set('joined', true);
            // this.storage.set('table', table);
            // this.events.publish('user:joined');
            // console.log('Ya existia la mesa, uniendose');
            // console.log('fin unirse a mesa existente');
            // resolve(table);
        }
        else {
          this.validQR(QRId).then((res) => {
            console.log("res ",res);
            if(!res) {
              reject('QR Invalido');
            }
            else {
              resolve(null);
            }
          })
          
          // this.validQR(QRId).then((res) => {
          //   console.log("res ",res);
          //   if(!res) {
          //     reject('QR Invalido');
          //   }
          //   else {
          //     console.log('No existia mesa, creando mesa');
          //     this.apollo.mutate({
          //       mutation: CREATE_TABLE_MUTATION,
          //       variables: {
          //         QRId: QRId,
          //       },
          //       refetchQueries: ['TableQRQuery', 'AllTablesQuery']
          //     }).subscribe((response) => {
          //       console.log('Mesa creada');
          //       let table = response.data.createTable;
          //       this.joinTable(table.id, this.user.id);
          //       this.storage.set('joined', true);
          //       this.storage.set('table', table);
          //       this.events.publish('user:joined');
          //       console.log('Fin union a mesa creada');
          //       resolve(table);
          //     });
          //   }
          // });   
        }
      });
    }
  );
  }

  validQR(id) {
    return new Promise((resolve, reject) => {
      this.apollo.watchQuery<any>({
        query: QR_QUERY,
        variables: {
          description: id,
        },
      }).valueChanges.subscribe((response) => {  
          let qr = response.data.QR;
          // console.log("qr response", response);
          if(qr) {
            resolve(qr.nroMesa);
          }
          else {
            resolve(false);
          }
      });
    })
    
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

  updateTable(tableId) {
    this.apollo.mutate({
      mutation: FAKE_UPDATE_TABLE_MUTATION,
      variables: {
        tableId: tableId,
        dummy: "Fake update"
      }
    }).subscribe((response) => {
      console.log("Fake update");
    })
  }

  changeName(id, name) {
    this.apollo.mutate({
      mutation: UPDATE_TABLE_NAME_MUTATION,
      variables: {
        tableId: id,
        tableName: name
      }
    }).subscribe((response) => {
      console.log(response);
    })
  }

  changePicture(id, picture) {
    this.apollo.mutate({
      mutation: UPDATE_TABLE_PICTURE_MUTATION,
      variables: {
        tableId: id,
        tablePicture: picture
      }
    }).subscribe((response) => {
      console.log(response);
    })
  }

  exitTable(tableId) {
    return new Promise((resolve,reject) => {
      this.apollo.mutate({
        mutation: REMOVE_USER_FROM_TABLE_MUTATION,
        variables: {
          tableId: tableId,
          userId: this.user.id
        }
      }).subscribe((response) => {
        console.log(response);
        if(response.data.removeFromUserTable.usersUser.id == this.user.id) {
          resolve(true);
          this.storage.set('joined', false);
          this.storage.set('table', null);
        }
        else {
          resolve(false);
        }
      })
    });
  }

}
