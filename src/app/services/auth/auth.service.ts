import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterEvent } from '@angular/router';
import { DataService } from '../data.service';
import { DbfirestoreService } from '../dbfirestore/dbfirestore.service';
import { UserDetails } from "src/app/interfaces/user-details";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserDetails:UserDetails;

  constructor(
              private auth:AngularFireAuth, 
              private dbFire:DbfirestoreService,
              private dataservice: DataService) {  }

  
  loginAsTenant(userobj){
    return this.auth.signInWithEmailAndPassword(userobj.email,userobj.password);
  }

  RegisterasTenant(email,password){
    return this.auth.createUserWithEmailAndPassword(email,password);
  }

  logout(){
    this.currentUserDetails={
      name:null, phone:null , gender:null,
      email:null,imgUrl:null,uid:null,userType:null
    };
    this.dataservice.changeMessage('');
    this.dataservice.changeIsLoggedin(false);
    localStorage.removeItem('user');
    console.log(this.currentUserDetails);
    return this.auth.signOut();
  }

  setUserDetails(Data:UserDetails){
    this.currentUserDetails = Data;
    console.log(this.currentUserDetails);
  }
}
