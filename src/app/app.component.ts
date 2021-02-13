import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { DataService } from './services/data.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
declare const Buffer;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  NavRouteUpdateFlag = {
    Index: true,
    Admin: false,
  };
  title = 'KUoomFrontend';
  loading: boolean = false;
  user;
  isLoggedin = false;
  LocalStorageUserDetail;
  userType;
  white: boolean = false;
  constructor(
    private _router: Router,
    public translate: TranslateService,
    private auth: AuthService,
    private titleService: Title,
    private DataService: DataService
  ) {
    this._router.events.subscribe(
      (val) => {
        // console.log(this._router.url);
        this.UPDATE_NAV_ROUTER_FLAG(this._router.url);
      },
      (err) => {
        console.log('[EXCEPTION OCCURED!]');
      }
    );
  }

  // handleScroll() {
  //   let offset = window.pageYOffset;
  //   let elem = document.getElementById('main-head-id');
  //   let leftnavlink = document.getElementById('left-nav-links');
  //   let searchElem = document.getElementById('search-bar');
  //   let self = this;
  //   if (offset === 0) {
  //     if (this.white) {
  //       // this.DataService.changeremoveIndexSearchBar(false);
  //       // self.changeSearchStatus(false);
  //       leftnavlink.classList.remove('hide');
  //       elem.classList.remove('white');
  //       searchElem.classList.remove('scrollNav');
  //       this.white = false;
  //     }
  //   } else if (offset > 180) {
  //     if (!this.white) {
  //       // this.DataService.changeremoveIndexSearchBar(true);
  //       // self.changeSearchStatus(true);

  //       this.white = true;
  //       elem.classList.add('white');
  //       leftnavlink.classList.add('hide');
  //       searchElem.classList.add('scrollNav');
  //     }
  //   }
  // }

  username: string;
  isSuperUser: boolean = false;
  ngOnInit(): void {
    let self = this;

    window.addEventListener('scroll', () => {
      let offset = window.pageYOffset;
      let elem = document.getElementById('main-head-id');
      let leftnavlink = document.getElementById('left-nav-links');
      let searchElem = document.getElementById('search-bar');

      if (offset === 0) {
        if (this.white) {
          self.DataService.changeremoveIndexSearchBar(false);
          // self.changeSearchStatus(false);
          leftnavlink.classList.remove('hide');
          elem.classList.remove('white');
          searchElem.classList.remove('scrollNav');
          this.white = false;
        }
      } else if (offset > 180) {
        if (!this.white) {
          self.DataService.changeremoveIndexSearchBar(true);
          // self.changeSearchStatus(true);

          this.white = true;
          elem.classList.add('white');
          leftnavlink.classList.add('hide');
          searchElem.classList.add('scrollNav');
        }
      }
    });
    this.DataService.currentUsername.subscribe((data) => {
      this.username = data;
    });

    this.DataService.loadingStatus.subscribe((data) => {
      this.loading = data;
    });

    this.DataService.isSuperUser?.subscribe((data) => {
      this.isSuperUser = data;
    });

    this.DataService.currentTitleName.subscribe((data) => {
      this.titleService.setTitle(data);
    });

    this.DataService.currentisLoggedin.subscribe((data: boolean) => {
      if (typeof data == 'boolean') {
        this.isLoggedin = data;
      }
      console.log(this.isLoggedin);
    });

    this.DataService.currentuserType.subscribe((data) => {
      // console.log(data);

      this.userType = data;
    });

    this.DataService.currentlang.subscribe((data) => {
      this.translate.setDefaultLang(data);
    });
  }

  // AUTO_NAV_ROUTER_UPDATER(page){
  //   let i;
  //   let page_type;
  //   let Pages =Object.keys( this.NavRouteUpdateFlag);

  //   for(i=0;i<Pages.length;i++){
  //     if(Pages[i] == page){
  //       this.NavRouteUpdateFlag[Pages[i]] = true;
  //     }
  //     else{
  //       this.NavRouteUpdateFlag[Pages[i]] = false;
  //     }
  //   }
  // console.log(this.NavRouteUpdateFlag);
  // }

  UPDATE_NAV_ROUTER_FLAG(CurrentPage: any) {
    if (CurrentPage == Url_SuperPath['Index']) {
      this.NavRouteUpdateFlag.Index = true;
    } else {
      this.NavRouteUpdateFlag.Index = false;
    }
  }

  gotoregister() {
    this._router.navigate([Url_SuperPath['Register']]);
  }

  GetCurrentRoute() {
    let CurrentRoute = this._router.url;
    // console.log(CurrentRoute);
  }

  logout() {
    this.auth
      .logout()
      .then((res) => {
        this._router.navigate([Url_SuperPath['Index']]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  MyProfile() {
    if (this.userType == 'Tenant') {
      this._router.navigate([Url_SuperPath['tenantProfile']]);
    } else {
      this._router.navigate([Url_SuperPath['landlordProfile']]);
    }
  }
  toTenant() {
    this._router.navigate([Url_SuperPath['tenantProfile']]);
  }
  toLandlord() {
    this._router.navigate([Url_SuperPath['landlordProfile']]);
  }
  goToAboutPage() {
    this._router.navigate(['/AboutUs']);
  }

  search() {
    this._router.navigate([Url_SuperPath['SearchRoom']]);
  }

  ToHowdoesthisworkPage() {
    this._router.navigate([Url_SuperPath['howdoesthiswork']]);
  }
}
