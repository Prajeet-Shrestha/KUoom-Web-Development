import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterEvent } from '@angular/router';
import { DataService } from '../data.service';
import { DbfirestoreService } from '../dbfirestore/dbfirestore.service';
import { UserDetails } from 'src/app/interfaces/user-details';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { async } from 'rxjs/internal/scheduler/async';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserDetails: UserDetails;
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

  constructor(
    private FireBaseauth: AngularFireAuth,
    private dbFire: DbfirestoreService,
    public fireservice: AngularFirestore,
    private dataservice: DataService,
    private router: Router,
    private notify: NotifierService
  ) {}
  userCollection = this.fireservice.collection('users');
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
  loginAsTenant(userobj) {
    return this.FireBaseauth.signInWithEmailAndPassword(userobj.email, userobj.password);
  }

  RegisterasTenant(email, password) {
    return this.FireBaseauth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    this.currentUserDetails = {
      name: null,
      phone: null,
      gender: null,
      email: null,
      imgUrl: null,
      uid: null,
      userType: null,
    };
    this.dataservice.changeUserFullDetails({});
    this.dataservice.changeIsLoggedin(false);
    this.dataservice.changeMessage('');
    localStorage.removeItem('user');
    console.log(this.currentUserDetails);
    return this.FireBaseauth.signOut();
  }

  setUserDetails(Data: UserDetails) {
    this.currentUserDetails = Data;
    console.log(this.currentUserDetails);
  }
  userList_ONLYFORCHECKING = [];
  async signInwithGoogle(type) {
    let self = this;
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.FireBaseauth.signInWithPopup(provider);
    console.log(credential.user);
    console.log(credential);
    this.userCollection.ref
      .where('email', '==', credential.user.email.toString())
      .get()
      .then((querySnapshot) => {
        self.userList_ONLYFORCHECKING = [];
        querySnapshot.forEach(function (doc) {
          self.userList_ONLYFORCHECKING.push(doc.data());
        });

        console.log(self.userList_ONLYFORCHECKING);
        if (self.userList_ONLYFORCHECKING.length == 1) {
          if (self.userList_ONLYFORCHECKING[0].userType == type) {
            this.UpdateUserData(self.userList_ONLYFORCHECKING[0], type, false);
          } else {
            this.logout();
            this.notify.showNotification('INVALID USER', 'Please RelogIn using corrent Credentials', 'error');
          }
        } else if (self.userList_ONLYFORCHECKING.length >= 2) {
          this.logout().then((res) => {
            console.log(res);
          });
          this.logout();
          this.notify.showNotification('Something is Wrong', 'Please Reach out to 9810442111', 'error');
        } else {
          this.UpdateUserData(credential.user, type);
        }
      });
  }

  async signInwithFaceBook(type) {
    let self = this;
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.FireBaseauth.signInWithPopup(provider);

    this.userCollection.ref
      .where('email', '==', credential.user.email.toString())
      .get()
      .then((querySnapshot) => {
        self.userList_ONLYFORCHECKING = [];
        querySnapshot.forEach(function (doc) {
          self.userList_ONLYFORCHECKING.push(doc.data());
        });
        console.log(self.userList_ONLYFORCHECKING);
        if (self.userList_ONLYFORCHECKING.length == 1) {
          if (self.userList_ONLYFORCHECKING[0].userType == type) {
            this.UpdateUserData(credential.user, type, false);
          } else {
            this.notify.showNotification('INVALID USER', 'Please RelogIn using corrent Credentials', 'error');
          }
        } else if (self.userList_ONLYFORCHECKING.length >= 2) {
          this.logout().then((res) => {
            console.log(res);
          });
          this.notify.showNotification('Something is Wrong', 'Please Reach out to 9810442111', 'error');
        } else {
          this.UpdateUserData(credential.user, type);
        }
      });
  }

  private UpdateUserData(userObj, userType, newuser = true) {
    console.log(userObj);
    if (newuser) {
      console.log('New USER');
      let userDetails: UserDetails = {
        name: userObj.displayName,
        imgUrl: userObj.photoURL,
        email: userObj.email,
        userType: userType,
        phone: userObj.phoneNumber ? userObj.phoneNumber : '',
        gender: 'n/a',
        uid: userObj.uid.toString(),
      };
      this.dataservice.changeIsLoggedin(true);
      let user = {
        uid: userObj.uid.toString(),
        name: userObj.displayName,
        userType: this.enCode(userType),
        email: userObj.email,
        phone: userDetails.phone,
      };
      let Fullname = user.name.split(' ');
      this.dataservice.changeMessage(userDetails.name);
      this.dataservice.changeUserFullDetails({
        Fname: Fullname[0],
        Lname: Fullname[1],
        email: userDetails.email,
        phone: userDetails.phone,
      });
      this.dataservice.changeUserType(userType);
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(user));
      this.dbFire
        .registerNewUser(userDetails, userDetails.uid)
        .then((res) => {
          this.router.navigate([Url_SuperPath['SearchRoom']]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Old USER');

      let userDetails: UserDetails = {
        name: userObj.name,
        imgUrl: userObj.imgUrl,
        email: userObj.email,
        userType: userObj.userType,
        phone: userObj.phone ? userObj.phone : '',
        gender: userObj.gender,
        uid: userObj.uid.toString(),
      };
      this.dataservice.changeIsLoggedin(true);
      let user = {
        uid: userDetails.uid.toString(),
        name: userDetails.name,
        userType: this.enCode(userType),
        email: userDetails.email,
        phone: userDetails.phone,
      };
      let Fullname = user.name.split(' ');
      this.dataservice.changeMessage(userDetails.name);
      this.dataservice.changeUserFullDetails({
        Fname: Fullname[0],
        Lname: Fullname[1],
        email: userDetails.email,
        phone: userDetails.phone,
      });
      this.dataservice.changeUserType(userType);
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(user));
      this.dbFire
        .registerNewUser(userDetails, userDetails.uid)
        .then((res) => {
          this.router.navigate([Url_SuperPath['SearchRoom']]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  deleteUser() {}

  sendVerificationEmail() {}

  updatePassword() {}
}
