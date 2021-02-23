import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { UserDetails } from 'src/app/interfaces/user-details';
import { DbfirestoreService } from '../../../services/dbfirestore/dbfirestore.service';
import { DataService } from 'src/app/services/data.service';
// import { DataService } from './services/data.service';

export interface UserDetailsResposeMap {
  Fname: string;
  Lname: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css'],
})
export class TenantComponent implements OnInit {
  products = [
    {
      index: 0,
      like: true,
      url: 'assets/Roomexample/1.png',
      title: 'FURNISHED PRIVATE ROOM',
      subtitle: 'Single Room in 28 Kilo Neighbour',
      location: '28 Kilo, Dhulikhel',
      price: 'Rs. 3000',
      date: 'Available from 20th Oct, 2020',
      status: 'Booked',
    },
    {
      index: 0,
      like: true,
      url: 'assets/Roomexample/1.png',
      title: 'FURNISHED PRIVATE ROOM',
      subtitle: 'Single Room in 28 Kilo Neighbour',
      location: '28 Kilo, Dhulikhel',
      price: 'Rs. 3000',
      date: 'Available from 20th Oct, 2020',
      status: 'Booked',
    },
    // {
    //   index: 0,
    //   like: false,
    //   url: "assets/Roomexample/1.png",
    //   title: "FURNISHED PRIVATE ROOM",
    //   subtitle: "Single Room in 28 Kilo Neighbour",
    //   location: "28 Kilo, Dhulikhel",
    //   price: "Rs. 3000",
    //   date: "Available from 20th Oct, 2020",
    //   status: "Booked"
    // }
  ];

  ConfigForm: FormGroup;
  UserDetails: UserDetailsResposeMap;
  LocalStorageUserDetails;
  isVerifiedEmail = false;
  constructor(
    private _router: Router,
    private DataService: DataService,
    private fb: FormBuilder,
    private _DBfireService: DbfirestoreService
  ) {}
  BookingList = [];
  BOOKINGLIST_USABLE_DATA = [];
  ngOnInit(): void {
    this.LocalStorageUserDetails = JSON.parse(localStorage.getItem('user'));
    this.init_ConfigForm();
    this.DataService.isEmailVerified.subscribe((data) => {
      this.isVerifiedEmail = data;
    });
    this.DataService.currentUserFullDetails.subscribe((data: UserDetailsResposeMap) => {
      this.UserDetails = {
        email: data.email,
        phone: data.phone,
        Fname: data.Fname,
        Lname: data.Lname,
      };
    });
    let self = this;
    this._DBfireService.TENANT_GET_BOOKEDROOMLIST(this.LocalStorageUserDetails.uid).then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        self.BookingList.push(doc.data());
      });
      for (let i = 0; i < self.BookingList.length; i++) {
        this._DBfireService.getSelectedRoom(self.BookingList[i].RoomId).then((data) => {
          let remodeledData = data.data();
          const DataSet = {
            id: remodeledData.id,
            index: i,
            like: false,
            url: remodeledData.images.mainPhoto,
            title: (
              (remodeledData.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + remodeledData.roomType
            ).toUpperCase(),
            subtitle: 'Single Room in ' + remodeledData.location.name,
            location: remodeledData.location.name,
            price: 'Rs. ' + remodeledData.feeDetails.price.toString(),
            date: 'Available from 20th Oct, 2020',
            status: remodeledData.isAvailable ? 'Pending' : 'Booked',
          };

          self.BOOKINGLIST_USABLE_DATA.push(DataSet);
        });
      }
      self.DataService.changeLoadingStatus(false);
      console.log(self.BOOKINGLIST_USABLE_DATA);
    });
    // this._DBfireService
    //   .TENANT_GET_BOOKEDROOMLIST(this.LocalStorageUserDetails.uid)
    //   .catch((data) => {})
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  init_ConfigForm() {
    this.ConfigForm = this.fb.group({
      email: '',
      phone: '',
    });
  }
  onConfigSubmit() {
    console.log(this.ConfigForm.value);
  }

  eventCatcher(ev) {
    console.log(ev.target.getAttribute('aria-selected'));
    console.log(ev);
  }
  gotosearchRoom() {
    this._router.navigate([Url_SuperPath['SearchRoom']]);
  }
}
