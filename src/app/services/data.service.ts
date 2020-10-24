import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<string>('')
  currentMessage = this.messageSource.asObservable()
  LocalStorageUserDetail
  constructor() {
    try{
      this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
      this.changeMessage(this.LocalStorageUserDetail.name);
      // console.log(this.username);
    }
    catch(e){ }
   }

  changeMessage(message:string){
    this.messageSource.next(message);
  }
}
