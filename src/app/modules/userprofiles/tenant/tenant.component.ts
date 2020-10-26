import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { UserDetails } from 'src/app/interfaces/user-details';
import { DataService } from 'src/app/services/data.service';
// import { DataService } from './services/data.service';

export interface UserDetailsResposeMap{
  Fname: string;
  Lname: string;
  email: string;
  phone:string;
}

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})



export class TenantComponent implements OnInit {
  products = [
    {
      index: 0,
      like: false,
      url: "assets/Roomexample/1.png",
      title: "FURNISHED PRIVATE ROOM",
      subtitle: "Single Room in 28 Kilo Neighbour",
      location: "28 Kilo, Dhulikhel",
      price: "Rs. 3000",
      date: "Available from 20th Oct, 2020",
      status: "Booked"
    },
    {
      index: 0,
      like: false,
      url: "assets/Roomexample/1.png",
      title: "FURNISHED PRIVATE ROOM",
      subtitle: "Single Room in 28 Kilo Neighbour",
      location: "28 Kilo, Dhulikhel",
      price: "Rs. 3000",
      date: "Available from 20th Oct, 2020",
      status: "Booked"
    },
    // {
    //   index: 0,
    //   like: false,
    //   url: "assets/Roomexample/1.png",
    //   title: "FURNISHED PRIVATE ROOM",
    //   subtitle: "Single Room in 28 Kilo Neighbour",
    //   location: "28 Kilo, Dhulikhel",
    //   price: "Rs. 3000",
    //   date: "Available from 20th Oct, 2020",
    //   status: "Booked"
    // }
  ]

  UserDetails:UserDetailsResposeMap;
  constructor(private _router:Router, private DataService:DataService) { }

  ngOnInit(): void {
    this.DataService.currentUserFullDetails.subscribe((data:UserDetailsResposeMap)=>{
      console.log(data);
      this.UserDetails ={
        email: data.email,
        phone:data.phone,
        Fname:data.Fname,
        Lname:data.Lname}
    });
  }

  eventCatcher(ev){
    console.log(ev.target.getAttribute("aria-selected"));
    console.log(ev);
  }
  gotosearchRoom(){
    this._router.navigate([Url_SuperPath['SearchRoom']])
  }
}
