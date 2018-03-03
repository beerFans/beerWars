import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';


import { MyApp } from './app.component';
import { Configuration } from './app.constants';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RankingPage } from '../pages/ranking/ranking';
import { TablePage } from '../pages/table/table';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';

import { UserService } from '../services/user.service';

import {GraphQLModule} from './apollo.config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PipesModule } from '../pipes/pipes.module'


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RankingPage,
    TabsPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(Configuration.FIREBASE_CONFIG),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RankingPage,
    LoginPage,
    TabsPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    Facebook,
    GooglePlus
  ]
})
export class AppModule {}
