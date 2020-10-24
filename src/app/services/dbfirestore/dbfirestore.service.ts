import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbfirestoreService {

  constructor(public fireservice:AngularFirestore) { }

  registerNewUser(userData,userId:string){
    return this.fireservice.collection('users').doc(userId).set(userData);
  }

  getCurrentUserDetails(id){
    return this.fireservice.collection('users').doc(id).get()
  }
}
