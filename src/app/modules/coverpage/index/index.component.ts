import { Component, OnInit } from '@angular/core';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }

  search(){
    this._router.navigate([Url_SuperPath['SearchRoom']]);
  }

}
