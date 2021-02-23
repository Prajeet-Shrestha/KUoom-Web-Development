import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.css'],
})
export class UserprofilesComponent implements OnInit {
  constructor(private _DataService: DataService, private fireauth: AngularFireAuth) {
    this.fireauth.onAuthStateChanged((res) => {
      console.log(res);

      if (res) {
        if (res.emailVerified) {
          this._DataService.isEmailVerifiedStatus(true);
        }
        // console.log(res.emailVerified);
      }
    });
  }

  ngOnInit(): void {
    this._DataService.changeTitle('Dashboard | KUoom');
  }
}
