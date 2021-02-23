import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  LocalStorageUserDetail;
  constructor(private fireauth: AngularFireAuth, private CustomAuth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
    console.warn(this.CustomAuth.deCode(this.LocalStorageUserDetail.userType), next.data.userType);
    if (this.CustomAuth.deCode(this.LocalStorageUserDetail.userType) == next.data.userType) {
      return true;
    } else {
      console.warn('ACCESS DENIED');
      return false;
    }
    // this.fireauth.onAuthStateChanged((res) => {
    //   console.log(res);
    //   let data = {};
    //   if (res) {
    //     data = {
    //       name: res.displayName,
    //       email: res.email,
    //       photoUrl: res.photoURL,
    //       emailVerified: res.emailVerified,
    //       uid: res.uid,
    //     };
    //     console.log(data);
    //   } else {
    //     // No user is signed in.
    //     return false;
    //   }
    // });
  }
}
