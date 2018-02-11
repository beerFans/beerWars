import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';


import { Configuration } from '../app/app.constants';

// import { Configuration } from '../app/app.constants';
// import { FacebookErrorHandler } from '../utils/facebook-error-handler';
// import { FirebaseErrorHandler } from '../utils/firebase-error-handler';
// import { GooglePlusErrorHandler } from '../utils/googleplus-error-handler';

// import { User } from '../models/user.model';
import { User } from '../app/types';
import { Apollo } from 'apollo-angular';
import { CREATE_USER_MUTATION, USER_UID_QUERY, USER_TABLE_QUERY } from '../app/graphql';

@Injectable()
export class UserService {

  // private actionUrl: string;

  constructor(
    public storage : Storage, public fire: AngularFireAuth, private events: Events,
    private apollo : Apollo, private facebook: Facebook, private googlePlus: GooglePlus
    ) {
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if(firebase.auth().currentUser !== null) {
          this.storage.get('logged-in').then((value) => resolve(value === true));
        } else {
          resolve(false);
        }
      })
    }).catch((error)=> {console.log(error)})
  }

  getUser() {
    return this.storage.get('user').then((value) => {
      //mirarrrrrrrrrrrrr
      return value;
    })
  }


  loginWithFacebook(){
    // let permissions = [ 'public_profile', 'email' ];
    return new Promise((resolve, reject) => {
    //   this.fire.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    //   .then((res)=>{
    //     console.log("respuesta de firebase",res);
    //     this.loginHandler(res);
    //   })
    // })
    // let provider = new firebase.auth.FacebookAuthProvider();

    // firebase.auth().signInWithRedirect(provider).then(()=>{
    //   firebase.auth().getRedirectResult().then((result)=>{
    //     console.log(result);
    //   }).catch(function(error){
    //     console.log(error);
    //   })
      let permissions = [ 'public_profile', 'email' ];
      this.facebook.login(permissions).then((loginResponse)=>{
        let credentials = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken)
        firebase.auth().signInWithCredential(credentials).then((info)=>{
          console.log(info);
        }).catch((error)=>{console.log(error);})
      }).catch((error)=>{console.log(error);})
    })
  }

  loginWithGoogle(){
    // return new Promise((resolve, reject) => {
    //   this.fire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    //   .then((res)=>{
    //     console.log(res);
    //     this.loginHandler(res);
    //   })
    // })

    let options = { 'webClientId': Configuration.GOOGLE_WEB_CLIENT_ID, 'offline': false };
    return new Promise((resolve, reject) => {
      this.googlePlus.login(options).then(response => {
        let credential = firebase.auth.GoogleAuthProvider.credential(response.idToken);
        firebase.auth().signInWithCredential(credential).then((success) => {
          // console.log("success"+JSON.stringify(success));
          // console.log("response"+JSON.stringify(response));
          this.storage.set('logged-in', true);
          this.loginHandler(success);
          //this.storage.set('user', user);
          this.events.publish('user:login');
          resolve(true);
        })
      })
    })


  }

  logout() {
    return new Promise((resolve, reject) => {
      this.fire.auth.signOut().then(() => {
        this.storage.set('logged-in',false);
        this.storage.remove('user');
        this.events.publish('user:logout');
        firebase.auth().signOut().then().catch(() => {});
        resolve(true);
      }).catch((error: any) => { reject("error al hacer logout") });
    });
  }

  loginHandler(res){
    let user:User;
    //return new Promise((resolve,reject)=>{
      this.getGraphUser(res.uid).then((userGraph)=>{
        if (userGraph) {
          user = userGraph;
          console.log("user de graph",user);
          this.storage.set('logged-in', true);
          this.storage.set('user', user);
          this.events.publish('user:login');
          //resolve(true);
        }
        else{
          this.apollo.mutate({
            mutation: CREATE_USER_MUTATION,
            variables:{
              uid:res.uid,
              name:res.displayName,
              avatarURL:res.photoURL,
              email: res.email
            },
            refetchQueries:['USER_UID_QUERY']

          }).subscribe((response)=>{
            console.log("response de create",response);
            user = response.data.User;
            console.log("user",user)
            this.storage.set('logged-in', true);
            this.storage.set('user', response.data.createUser);
            this.events.publish('user:login');
            //resolve(true);
          })
        }
      })
    //})
  }

  getGraphUser(uid){
    return new Promise((resolve,reject)=>{
      this.apollo.watchQuery<any>({
        query:USER_UID_QUERY,
        variables:{
          uid:uid,
        },
      }).valueChanges.subscribe((response)=>{
        console.log("response de query", response);
        resolve(response.data.User);
      })
    })
  }

  isJoined(userId) {
    return new Promise((resolve, reject) => {
      this.apollo.watchQuery<any>({
        query: USER_TABLE_QUERY,
        variables: {
          id: userId,
        },
      }).valueChanges.subscribe((response) => {
        // 5
        console.log(response);

        if (response.data.User.table) {
          console.log("user table",response.data.User);
          this.storage.set('joined', true);
          this.storage.set('table', response.data.User.table);
          // this.events.publish('user:joined');
          this.storage.get('joined').then((value) => resolve(value === true));
        }
        else{
          this.storage.set('joined', false);
          resolve(false);

        }
      })
    }).catch((error)=> {console.log(error)})
  }

  getUserTable() {
    return this.storage.get('table').then((value) => {
      //mirarrrrrrrrrrrrr
      return value;
    })
  }

  exitTable() {
    this.storage.set('joined', false);
    //Aca seguro van mas cosas!!!
  }


}
