import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { DataService } from './services/data.service';
import { AuthService } from "src/app/services/auth/auth.service";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  NavRouteUpdateFlag={
    Index:true
  }
  title = 'KUoomFrontend';
  user;
  isLoggedin=false;
  LocalStorageUserDetail;
  userType;
  constructor(private _router:Router, public translate:TranslateService,private auth:AuthService,private DataService:DataService){
  
    this._router.events.subscribe(
      (val)=>{
        // console.log(this._router.url);
        this.UPDATE_NAV_ROUTER_FLAG(this._router.url)
        
      },
      (err)=>{
        console.log("[EXCEPTION OCCURED!]")
      }
    )
  }
  username:string;
  ngOnInit(): void {
    this.DataService.currentUsername.subscribe((data)=>{
      this.username = data;
    });

    this.DataService.currentisLoggedin.subscribe((data:boolean)=>{
      
      if(typeof data == 'boolean'){
        this.isLoggedin = data;
      } 
      console.log(this.isLoggedin);
    });

    this.DataService.currentuserType.subscribe((data)=>{
      // console.log(data);
    
      this.userType = data;
    })

    this.DataService.currentlang.subscribe((data)=>{
      this.translate.setDefaultLang(data);
    })
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

  UPDATE_NAV_ROUTER_FLAG(CurrentPage:any)
  {
    if (CurrentPage == Url_SuperPath['Index']){
      this.NavRouteUpdateFlag.Index = true;
    }
    else{
      this.NavRouteUpdateFlag.Index = false;
    }

  }
 
  gotoregister(){
    this._router.navigate([Url_SuperPath['Register']]);
  }

  GetCurrentRoute(){
    let CurrentRoute = this._router.url;
    // console.log(CurrentRoute);
  }

  logout(){
    this.auth.logout().then((res)=>{
      this._router.navigate([Url_SuperPath['Index']]);
    }).catch((err)=>{
      console.log(err);
    })
  }

  MyProfile(){
    if(this.userType == 'Tenant'){
      this._router.navigate([Url_SuperPath['tenantProfile']]);
    }
    else{
      this._router.navigate([Url_SuperPath['landlordProfile']]);

    }
  }
  
}
