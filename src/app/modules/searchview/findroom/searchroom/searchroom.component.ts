import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { Observable, Observer } from 'rxjs';


export interface room{
  index:number;
  like:boolean;
  url:string;
  title:string;
  subtitle:string;
  location:string;
  price:string;
  date:string;
  status:string;
} 

@Component({
  selector: 'app-searchroom',
  templateUrl: './searchroom.component.html',
  styleUrls: ['./searchroom.component.css']
})
export class SearchroomComponent implements OnInit {
  
  SelectedFilters = ['Private Room','Wifi',"Rs.3000+"]
  products:room[] =[
    {
      index:0,
      like:false,
      url:"assets/Roomexample/1.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 3000",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
    {
      index:1,
      like:false,
      url:"assets/Roomexample/4.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 4500",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
    {
      index:2,
      like:true,
      url:"assets/Roomexample/3.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 3000",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
    {
      index:3,
      like:false,
      url:"assets/Roomexample/5.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 3000",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
    {
      index:4,
      like:false,
      url:"assets/Roomexample/6.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 3000",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
  ]; 


  constructor(private _router:Router) {
   }

  ngOnInit(): void {
  }

  
  updatelike(product){
    if(product.like){
      product.like = false;
    }
    else{
      product.like = true;
    }

  }

  RoomProfileNavigate(){
    this._router.navigate([Url_SuperPath['ProductProfile']]);
  }
  price = 3000;
 
  MaxPrice = 3000;

  
  PriceRangeformatLabel(value: number) {
    this.MaxPrice = value;
    // console.log(this.MaxPrice);
    if (value >= 1000) {
      
      return Math.round(value / 1000) + 'k';
    }

   
  }
}
