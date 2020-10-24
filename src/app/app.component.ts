import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  NavRouteUpdateFlag={
    Index:true,
    Register:false,
    SearchRoom:false,
    login:false
  }
  title = 'KUoomFrontend';
  LocalStorageUserDetail;
  constructor(private _router:Router, private auth:AngularFireAuth,private DataService:DataService){
   
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
    this.DataService.currentMessage.subscribe((data)=>{
      this.username = data
    })
  }

  AUTO_NAV_ROUTER_UPDATER(page){
    let i;
    let page_type;
    let Pages =Object.keys( this.NavRouteUpdateFlag);
    
    for(i=0;i<Pages.length;i++){
      if(Pages[i] == page){
        this.NavRouteUpdateFlag[Pages[i]] = true;
      }
      else{
        this.NavRouteUpdateFlag[Pages[i]] = false;
      }
    }
    // console.log(this.NavRouteUpdateFlag);
  }

  UPDATE_NAV_ROUTER_FLAG(CurrentPage:any)
  {
    switch(CurrentPage)
    {
      case Url_SuperPath['SearchRoom']:
        // console.log("CASE SEARCH ROOM");
        this.AUTO_NAV_ROUTER_UPDATER('SearchRoom');
        break
      case Url_SuperPath['Register']:
        this.AUTO_NAV_ROUTER_UPDATER("Register");
        break
      case Url_SuperPath['Index']:
        this.AUTO_NAV_ROUTER_UPDATER('Index');
        break
      case Url_SuperPath['login']:
        this.AUTO_NAV_ROUTER_UPDATER('login');
        break
    };
  }
 
  gotoregister(){
    this._router.navigate([Url_SuperPath['Register']]);
  }

  GetCurrentRoute(){
    let CurrentRoute = this._router.url;
    // console.log(CurrentRoute);
  }

  logout(){
    this.auth.signOut().then((res)=>{
      this._router.navigate([Url_SuperPath['Index']]);
    }).catch((err)=>{
      console.log(err);
    })
  }
  
}
