import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usernameSource = new BehaviorSubject<string>('')
  private isLoggedinSource = new BehaviorSubject<boolean>(false)
  private userTypeSource = new BehaviorSubject<string>('');

  currentUsername = this.usernameSource.asObservable()
  currentisLoggedin = this.isLoggedinSource.asObservable();
  currentuserType = this.userTypeSource.asObservable();
  
  LocalStorageUserDetail
  constructor() {
    try{
      this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
      if(this.LocalStorageUserDetail == null){
        this.isLoggedinSource.next(false);
      }
      else{
        this.isLoggedinSource.next(true);
        // console.log(this.LocalStorageUserDetail.userType);
        this.changeUserType(this.LocalStorageUserDetail.userType.toString());
        this.changeMessage(this.LocalStorageUserDetail.name);
      }
    }
    catch(e){ }
   }

  changeMessage(message:string){
    this.usernameSource.next(message);
  }

  changeIsLoggedin(status:boolean){
    this.isLoggedinSource.next(status);
  }

  changeUserType(type:'Tenant' | 'Landlord'){
    this.userTypeSource.next(type);
  }
}
