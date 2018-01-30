import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NavController } from 'ionic-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, CreateTableMutationResponse } from '../../app/graphql';
import { TableService } from '../../services/table.service';
import { UserService } from '../../services/user.service';

import { Table, User } from '../../app/types'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TableService],
})
export class HomePage {

  public table : Table;
  public user: User;
  public joined;

  constructor(private apollo: Apollo, public navCtrl: NavController,private ts:TableService, private userService: UserService) {
    // this.userService.getUser().then((user)=>{
    //   this.user = user;
    //   this.userService.isJoined(user.id).then((joined) => {
    //     this.joined = joined;
    //   })
    // })
  }


  joinTable() {
    //Scan QR, me devuelve un id
    let QR = this.scanQR(); //Solo para probar, seria el que me devuelve el QR
    //Si no existe mesa con dicho id de qr, la creo (?)

    this.ts.getTableByQR(QR).then((table) => {
      console.log(table);
        this.table = table;
        console.log(this.table.beerCount);
    });

  }

  scanQR() { //Esto deberia encargarse de escanear el codigo y retornar el id
    return 'cjc6rtajgn9dx0173uusnyhto';
  }

}
