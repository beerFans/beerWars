import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

// import { Configuration } from '../app/app.constants';
// import { FacebookErrorHandler } from '../utils/facebook-error-handler';
// import { FirebaseErrorHandler } from '../utils/firebase-error-handler';
// import { GooglePlusErrorHandler } from '../utils/googleplus-error-handler';

// import { User } from '../models/user.model';
import { User } from '../app/types';
import { Apollo } from 'apollo-angular';
import { CREATE_USER_MUTATION, USER_UID_QUERY } from '../app/graphql';

@Injectable()
export class UserService {

  private actionUrl: string;

  constructor(
    public storage : Storage, public fire: AngularFireAuth, private events: Events,
    private apollo : Apollo, private facebook: Facebook
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
    return new Promise((resolve, reject) => {
      this.fire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res)=>{
        console.log(res);
        this.loginHandler(res);
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
      this.getGraphUser(res.user.uid).then((userGraph)=>{
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
              uid:res.user.uid,
              name:res.user.displayName,
              avatarURL:res.user.photoURL,
              email: res.user.email
            },
            refetchQueries:['USER_UID_QUERY']

          }).subscribe((response)=>{
            console.log("response de create",response);
            user = response.data.User;
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


}