import { Component, OnInit } from '@angular/core';

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
  selector: 'app-findroom',
  templateUrl: './findroom.component.html',
  styleUrls: ['./findroom.component.css']
})
export class FindroomComponent implements OnInit {

  products:room[] =[
    {
      index:0,
      like:false,
      url:"../../../../assets/Roomexample/1.png",
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
      url:"../../../../assets/Roomexample/4.png",
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
      url:"../../../../assets/Roomexample/3.png",
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
      url:"../../../../assets/Roomexample/5.png",
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
      url:"../../../../assets/Roomexample/6.png",
      title:"FURNISHED PRIVATE ROOM",
      subtitle:"Single Room in 28 Kilo Neighbour",
      location:"28 Kilo, Dhulikhel",
      price:"Rs. 3000",
      date:"Available from 20th Oct, 2020",
      status:"Booked"
    },
  ]; 

  constructor() { }

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
}