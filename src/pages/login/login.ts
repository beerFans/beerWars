import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService]
})
export class LoginPage {
  connection = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl: LoadingController, private userService:UserService,
              private alertCtrl: AlertController, private viewCtrl: ViewController,
              private network: Network
            ){
  }

  ionViewDidLoad() {
    if(this.network.type === 'none'){
      this.connection = false;

      this.network.onConnect().subscribe(data => {
        this.connection = true;
        console.log(data)
      }, error => console.error(error));
    }
  }

  loginWithFacebook() {
    let loader = this.loadingCtrl.create({ dismissOnPageChange: true });
    loader.present();
    this.userService.loginWithFacebook()
      .then((result) => {
        if(result) { loader.dismiss(); }
      })
      .catch((error) => {
        let alert = this.alertCtrl.create({
          title: 'Error al Iniciar Sesión',
          subTitle: error.message,
          buttons: [ 'Aceptar' ]
        });
        alert.present();
        loader.dismiss();
      });
  }

  loginWithGoogle() {
    let loader = this.loadingCtrl.create({ dismissOnPageChange: true });
    loader.present();
    this.userService.loginWithGoogle()
      .then((result) => {
        if(result) { loader.dismiss(); }
      })
      .catch((error) => {
        let alert = this.alertCtrl.create({
          title: 'Error al Iniciar Sesión',
          subTitle: error.message,
          buttons: [ 'Aceptar' ]
        });
        alert.present();
        loader.dismiss();
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
