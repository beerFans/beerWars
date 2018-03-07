
     
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { UserService } from '../../services/user.service';

import { User } from '../../app/types';

import { AlertController } from 'ionic-angular';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user;
  avatarUrl;
	//hasPicture = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
  						private userService: UserService, private alertCtrl: AlertController ) 
  {
  	this.userService.getUser().then((user)=>{
      this.user = user;
      this.avatarUrl = user.avatarUrl;

    	// if(user != undefined && user.avatarUrl != null && user.avatarUrl != "" ){
    	// 	//this.hasPicture = true;
    	// }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  changePicture() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 250,
      targetHeight: 250,
      allowEdit:true,
      correctOrientation: true
    }
    
    this.camera.getPicture(options).then((imgUrl) => {
      
      //console.log(imgUrl);
      let base64Image = 'data:image/jpeg;base64,' + imgUrl;
      this.userService.setProfileImg(base64Image, this.user.id).then((img:string)=>{
      	//console.log("img en profile", img);
      	console.log("user", this.user);
      	this.avatarUrl = base64Image;
      	//this.hasPicture = true;
      });
      //this.ts.changePicture(this.table.id, base64Image);

    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  logOut() {
    let alert = this.alertCtrl.create({
      title: 'Log Out',
      message: '¿Seguro que deseas salir de tu cuenta?',
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
            console.log('Confirmar clicked');
            this.userService.logout();
          }
        }
      ]
    });
    alert.present();
  }

}
