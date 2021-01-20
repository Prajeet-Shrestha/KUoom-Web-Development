import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usernameSource = new BehaviorSubject<string>('')
  private isLoggedinSource = new BehaviorSubject<boolean>(false)
  private userTypeSource = new BehaviorSubject<string>('');
  private UserFullDetailsSource = new BehaviorSubject<object>({ });
  private langSource = new BehaviorSubject<string>('');

  currentlang = this.langSource.asObservable();
  currentUsername = this.usernameSource.asObservable()
  currentisLoggedin = this.isLoggedinSource.asObservable();
  currentuserType = this.userTypeSource.asObservable();
  currentUserFullDetails = this.UserFullDetailsSource.asObservable();

  LocalStorageUserDetail; LocalStorageLang;
  constructor() {

    try{
      console.log('Init Data Service');
      this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
      this.LocalStorageLang = localStorage.getItem('lang');

      if(this.LocalStorageLang == null){
        this.langSource.next('en'); 
        localStorage.setItem('lang','en');

      }
      else{
        this.langSource.next(this.LocalStorageLang.toString()); 
      }

      if(this.LocalStorageUserDetail == null){this.isLoggedinSource.next(false);}
      else{
        this.isLoggedinSource.next(true);
        let name = this.LocalStorageUserDetail.name.split(' ');
        const userdetails = {
          email: this.LocalStorageUserDetail.email.toString(),
          phone: this.LocalStorageUserDetail.phone.toString(),
          Fname: name[0],
          Lname: name[1]
        }
        this.UserFullDetailsSource.next(userdetails);
        this.changeUserType(this.LocalStorageUserDetail.userType.toString());
        this.changeMessage(this.LocalStorageUserDetail.name);
      }
    }
    catch(e){
      console.log(this.LocalStorageLang)
      if(this.LocalStorageLang == null){
        this.langSource.next('en'); 
        localStorage.setItem('lang','en');
        console.log(this.LocalStorageLang)
      }
     }
   }


  changeLang(lang:'en' | 'np'){
    this.langSource.next(lang);
    localStorage.setItem('lang',lang);

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

  changeUserFullDetails(obj){
    this.UserFullDetailsSource.next(obj);
  }
}
