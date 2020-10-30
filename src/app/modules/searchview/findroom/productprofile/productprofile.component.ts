import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productprofile',
  templateUrl: './productprofile.component.html',
  styleUrls: ['./productprofile.component.css']
})
export class ProductprofileComponent implements OnInit {

  constructor() { }
  imageObject: Array<object> = [{
    image: 'assets/Roomexample/1.png',
    thumbImage: 'assets/Roomexample/1.png',
    alt: 'alt of image',
    title: 'FURNISHED PRIVATE ROOM'
}, 
{
  image: 'assets/Roomexample/1.png',
  thumbImage: 'assets/Roomexample/1.png',
  alt: 'alt of image',
  title: ''
}, 
];


  ngOnInit(): void {
  }

}
