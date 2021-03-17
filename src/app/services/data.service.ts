import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DbfirestoreService } from './dbfirestore/dbfirestore.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private usernameSource = new BehaviorSubject<string>('');
  private isLoggedinSource = new BehaviorSubject<boolean>(false);
  private userTypeSource = new BehaviorSubject<string>('');
  private UserFullDetailsSource = new BehaviorSubject<object>({});
  private langSource = new BehaviorSubject<string>('');
  private removeIndexSearchBar = new BehaviorSubject<boolean>(false);
  private _loadingStatus = new BehaviorSubject<boolean>(false);
  private titleNameSourve = new BehaviorSubject<string>('KUoom | Find Your Room');
  private roomIdSource = new BehaviorSubject<string>('');
  private MaxPriceSource = new BehaviorSubject<number>(0);
  private isSuperUserAccountSource = new BehaviorSubject<boolean>(false);
  private userImgSource = new BehaviorSubject<string>('');
  private isEditRoomSource = new BehaviorSubject<boolean>(false);
  private isEmailVerifiedSource = new BehaviorSubject<boolean>(false);
  private indexDateFilterSouce = new BehaviorSubject<any>(false);
  private applicantViewIdSource = new BehaviorSubject<string>('');
  currentMaxPrice = this.MaxPriceSource.asObservable();
  currentlang = this.langSource.asObservable();
  currentUsername = this.usernameSource.asObservable();
  currentisLoggedin = this.isLoggedinSource.asObservable();
  currentuserType = this.userTypeSource.asObservable();
  currentUserFullDetails = this.UserFullDetailsSource.asObservable();
  currentremoveIndexSearchBar = this.removeIndexSearchBar.asObservable();
  loadingStatus = this._loadingStatus.asObservable();
  currentTitleName = this.titleNameSourve.asObservable();
  currentroomIdSource = this.roomIdSource.asObservable();
  isSuperUser? = this.isSuperUserAccountSource.asObservable();
  isEmailVerified = this.isEmailVerifiedSource.asObservable();
  currentUserImg = this.userImgSource.asObservable();
  isEditRoom = this.isEditRoomSource.asObservable();
  indexDateFilter = this.indexDateFilterSouce.asObservable();
  currentApplicantId = this.applicantViewIdSource.asObservable();
  LocalStorageUserDetail;
  LocalStorageLang;
  code = {
    T: 'QJA+',
    e: '++4=',
    n: 'oeKR',
    o: 'Pz/0',
    a: 'ePz/',
    t: '++uH',
    L: 'eKR6',
    l: 'XIak',
    r: 'gQJA',
    d: 'aE2w',
  };

  constructor(private fireservice: AngularFirestore) {
    try {
      console.log('Init Data Service');
      this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
      this.LocalStorageLang = localStorage.getItem('lang');

      if (this.LocalStorageLang == null) {
        this.langSource.next('en');
        localStorage.setItem('lang', 'en');
      } else {
        this.langSource.next(this.LocalStorageLang.toString());
      }

      if (this.LocalStorageUserDetail == null) {
        this.isLoggedinSource.next(false);
      } else {
        this.isLoggedinSource.next(true);
        this.userCollection.ref
          .where('uid', '==', this.LocalStorageUserDetail.uid)
          .get()
          .then((res) => {
            let list = [];
            res.forEach((data) => {
              list.push(data.data());
            });
            if (list.length == 1) {
              this.userImgSource.next(list[0].imgUrl);
            }
          });
        let name = this.LocalStorageUserDetail.name.split(' ');
        const userdetails = {
          email: this.LocalStorageUserDetail.email.toString(),
          phone: this.LocalStorageUserDetail.phone.toString(),
          Fname: name[0],
          Lname: name[1],
        };
        if (this.LocalStorageUserDetail.uid.toString() == 'gRgumEJMzWYxdeXFNgC20lSi2pd2') {
          this.isSuperUserAccountSource.next(true);
        }
        this.UserFullDetailsSource.next(userdetails);
        let userType_Decrypted = this.deCode(this.LocalStorageUserDetail.userType.toString());
        this.changeUserType(userType_Decrypted);
        this.changeMessage(this.LocalStorageUserDetail.name);
      }
    } catch (e) {
      console.log(this.LocalStorageLang);
      if (this.LocalStorageLang == null) {
        this.langSource.next('en');
        localStorage.setItem('lang', 'en');
        console.log(this.LocalStorageLang);
      }
    }
  }
  userCollection = this.fireservice.collection('users');
  changeLang(lang: 'en' | 'np') {
    this.langSource.next(lang);
    localStorage.setItem('lang', lang);
  }
  changeremoveIndexSearchBar(status: boolean) {
    window.console.log('stytsyst', status);
    this.removeIndexSearchBar.next(status);
  }
  changeMessage(message: string) {
    this.usernameSource.next(message);
  }
  changeIndexDateFilter(date: any) {
    this.indexDateFilterSouce.next(date);
  }
  changeIsSupperAccount(status) {
    this.isSuperUserAccountSource.next(status);
  }

  changeMaxPriceInSearch(price: number) {
    this.MaxPriceSource.next(price);
  }
  changeRoomId(id: string) {
    this.roomIdSource.next(id);
  }

  changeApplicantId(id: string) {
    this.applicantViewIdSource.next(id);
  }

  isEmailVerifiedStatus(status: boolean) {
    console.log('In DS Email Ver:', status);
    this.isEmailVerifiedSource.next(status);
  }

  changeTitle(message: string) {
    this.titleNameSourve.next(message);
  }
  changeIsLoggedin(status: boolean) {
    this.isLoggedinSource.next(status);
  }

  changeUserType(type) {
    this.userTypeSource.next(type);
  }

  changeUserFullDetails(obj) {
    this.UserFullDetailsSource.next(obj);
  }

  changeLoadingStatus(bool) {
    this._loadingStatus.next(bool);
  }

  changeisEditRoomValue(bool: boolean) {
    this.isEditRoomSource.next(bool);
  }

  enCode(string: string) {
    let encrypt = '';
    for (let i = 0; i < string.length; i++) {
      encrypt += this.code[string[i]];
    }
    return encrypt;
  }

  private _getKeyByValue(value) {
    return Object.keys(this.code)
      .find((key) => this.code[key] === value)
      .toString();
  }

  deCode(string: string) {
    let decrypt = '';
    for (let i = 0; i < string.length; i += 4) {
      decrypt += this._getKeyByValue(string.slice(i, i + 4));
    }
    return decrypt;
  }
}
