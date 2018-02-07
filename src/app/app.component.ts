
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RankingPage } from '../pages/ranking/ranking';
import { LoginPage } from '../pages/login/login';

import { UserService } from '../services/user.service';

import { User } from '../models/user.model';

export interface PageInterface {
  title: string;
  description: string;
  component: any;
  icon: string;
  badge?: boolean;
  logsOut?: boolean;
  validate?:boolean;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  public user: User;

  pages: Array<{title: string, component: any}>;

  appPages: PageInterface[] = [
  {
    title: 'Home', description: 'Ver el Pagina Inicial',
    component: RankingPage, icon: 'coop-usuario'
  },
  {
    title: 'Ranking', description: 'Ver el Ranking',
    component: RankingPage, icon: 'coop-usuario'
  },
  {
    title: 'Salir', description: 'Salir de la aplicaci\u00f3n',
    component: LoginPage, icon: 'coop-exit', logsOut: true
  },
  ];


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private userService:UserService, private storage: Storage, private menuCtrl: MenuController,
    public events: Events,public loadingCtrl: LoadingController, public alertCtrl: AlertController
    )
  {
    this.listenToLoginEvents();

    userService.isLoggedIn().then((loggedIn) => {
      platform.ready().then(() => {
        if(loggedIn) {
          this.userService.getUser().then((user) => {
            this.user = user;
          });
          this.rootPage = HomePage;
        } else {
          this.menuCtrl.enable(false);
          this.rootPage = LoginPage;
        }

        setTimeout(() => { this.splashScreen.hide(); }, 2000);
      });
    });
    // this.rootPage = HomePage;
  }

  openPage(page: PageInterface) {
    if(!page.logsOut) {
      this.nav.push(page.component);
    } else {
      this.userService.logout()
      .then((result) => {})
      .catch((error) => {
        let alert = this.alertCtrl.create({
          title: 'Error al Cerrar Sesión',
          subTitle: error.message,
          buttons: [ 'Aceptar' ]
        });
        alert.present();
      });
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
    //let loader = this.loadingCtrl.create({ dismissOnPageChange: true });
    //loader.present();
    this.nav.setRoot(HomePage).then(() => {
      this.userService.getUser().then((user) => {
        this.user = user;
        //loader.dismiss().then(() => {});
      });
    }).catch(() => {});
  });
    this.events.subscribe('user:logout', () => {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.nav.setRoot(LoginPage).then(() => {
        loader.dismiss().then(() => {});
      }).catch(() => {});
    });
  }

}
