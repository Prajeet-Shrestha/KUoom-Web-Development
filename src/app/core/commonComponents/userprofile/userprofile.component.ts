import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent implements OnInit {
  @Input() FirstName: string;
  @Input() LastName: string;
  @Input() Email: string;
  @Input() Phone: string;
  constructor(
    private _fireService: DbfirestoreService,
    private _router: Router,
    // private DataService: DataService,
    private fb: FormBuilder
  ) {}
  ConfigForm: FormGroup;
  ngOnInit(): void {
    this.init_ConfigForm();
  }
  init_ConfigForm() {
    this.ConfigForm = this.fb.group({
      email: '',
      phone: '',
    });
  }
  onConfigSubmit() {}
}
