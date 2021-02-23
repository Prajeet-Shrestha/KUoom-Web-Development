import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
// import { DataService } from 'src/app/services/data.service';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import { FirestoreQueryService } from 'src/app/services/firestorequery/firestore-query.service';

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
  @Input() uid: string;
  @Input() isVerifed: boolean;
  constructor(
    private _fireService: DbfirestoreService,
    private _router: Router,
    // private DataService: DataService,
    private _fireAuth: AngularFireAuth,
    private Notify: NotifierService,
    private FireQuery: FirestoreQueryService,
    private fb: FormBuilder
  ) {}
  ConfigForm: FormGroup;
  userDetailsForm: FormGroup;
  EditMode: boolean = false;
  LocalStorageUserDetails;
  ngOnInit(): void {
    this.LocalStorageUserDetails = JSON.parse(localStorage.getItem('user'));

    this.init_ConfigForm();
  }
  init_ConfigForm() {
    this.userDetailsForm = this.fb.group({
      Fname: ['', Validators.required],
      Lname: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: [Date, Validators.required],
    });
    this.ConfigForm = this.fb.group({
      email: '',
      phone: '',
    });
  }

  ToggleEditMode() {
    this.EditMode = this.EditMode ? false : true;
  }
  onConfigSubmit() {}
  sendVerficationMail() {
    this._fireAuth.onAuthStateChanged((res) => {
      if (res) {
        res
          .sendEmailVerification()
          .then((res) => {
            this.Notify.showNotification('Email Sent', 'Please Check your mail', 'success');
          })
          .catch((err) => {
            this.Notify.showNotification('Something went wrong Please Try Again', '', 'error');
          });
      }
    });
  }

  SaveUserData() {
    if (this.userDetailsForm.valid) {
      let userObj = {
        name: this.userDetailsForm.value.Fname + ' ' + this.userDetailsForm.value.Lname,
        phone: this.userDetailsForm.value.Phone,
      };
      // console.log(this.uid);
      this.FireQuery.UpdateUserInfo(this.LocalStorageUserDetails.uid, userObj)
        .then((res) => {
          this.EditMode = false;
          const userdetails = {
            email: this.LocalStorageUserDetails.email,
            name: userObj.name,
            phone: userObj.phone,
            uid: this.LocalStorageUserDetails.uid,
            userType: this.LocalStorageUserDetails.userType,
          };
          localStorage.setItem('user', JSON.stringify(userdetails));
          this.Notify.showNotification('Profile Edited', 'New Info Added', 'success');
        })
        .catch((err) => {
          this.Notify.showNotification('Failed', 'OPPs! Something Went Wrong', 'error');
        });
    } else {
      this.Notify.showNotification('Invalid Form', 'Please Fill the form', 'error');
    }
  }
}
