import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.css'],
})
export class UserprofilesComponent implements OnInit {
  constructor(private _DataService: DataService) {}

  ngOnInit(): void {
    this._DataService.changeTitle('Dashboard | KUoom');
  }
}
