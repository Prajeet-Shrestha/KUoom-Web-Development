import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coverpage',
  templateUrl: './coverpage.component.html',
  styleUrls: ['./coverpage.component.css']
})
export class CoverpageComponent implements OnInit {

  active =1;
  constructor(
    private _router:Router
  ) { }

  ngOnInit(): void {
  }

  gotoregister(){
    this._router.navigate(["/auth/register"]);
  }

}
