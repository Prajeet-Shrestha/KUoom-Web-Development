import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usernameSource = new BehaviorSubject<string>('')
  private isLoggedinSource = new BehaviorSubject<boolean>(false)

  currentUsername = this.usernameSource.asObservable()
  currentisLoggedin = this.isLoggedinSource.asObservable();
  
  LocalStorageUserDetail
  constructor() {
    try{
      this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
      if(this.LocalStorageUserDetail == null){
        this.isLoggedinSource.next(false);
      }
      else{
        this.isLoggedinSource.next(true);
      }
      this.changeMessage(this.LocalStorageUserDetail.name);
      // console.log(this.username);
    }
    catch(e){ }
   }

  changeMessage(message:string){
    this.usernameSource.next(message);
  }

  changeIsLoggedin(status:boolean){
    this.isLoggedinSource.next(status);
  }
}
