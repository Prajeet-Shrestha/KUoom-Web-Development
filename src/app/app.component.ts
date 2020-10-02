import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KUoomFrontend';
  constructor(private _router:Router){
    
  }
  gotoregister(){
    this._router.navigate(["/auth/register"]);
  }
}
