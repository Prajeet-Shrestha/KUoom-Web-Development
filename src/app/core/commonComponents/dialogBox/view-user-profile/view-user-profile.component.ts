import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsResposeMap } from 'src/app/modules/userprofiles/tenant/tenant.component';
import { DataService } from 'src/app/services/data.service';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css'],
})
export class ViewUserProfileComponent implements OnInit {
  constructor(
    public dialogref: MatDialogRef<ViewUserProfileComponent>,
    private dataservice: DataService,
    private firestore: DbfirestoreService
  ) {}
  applicantId = '';
  LandlordImgtrue: boolean = false;
  UserDetails = { email: '', gender: '', imgUrl: '', userType: '', phone: '', name: '', uid: '' };
  ngOnInit(): void {
    this.dataservice.currentApplicantId.subscribe((res) => {
      this.applicantId = res;
      this.firestore.getCurrentUserDetails(res).subscribe((data) => {
        let doc = data.data();
        this.UserDetails = {
          name: doc.name,
          email: doc.email,
          imgUrl: doc.imgUrl,
          userType: doc.userType,
          phone: doc.phone,
          uid: doc.uid,
          gender: doc.gender,
        };
        if (this.UserDetails.imgUrl.length >= 2) {
          this.LandlordImgtrue = true;
        }
        // this.UserDetails = {
        //   email: data.email,
        //   phone: data.phone,
        //   Fname: data.Fname,
        //   Lname: data.Lname,
        // };
      });
    });
  }
}
