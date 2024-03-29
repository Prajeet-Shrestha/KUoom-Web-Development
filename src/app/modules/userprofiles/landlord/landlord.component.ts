import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserDetailsResposeMap } from '../tenant/tenant.component';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';

import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { MatTabChangeEvent } from '@angular/material/tabs';
// import * as EventEmitter from 'events';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landlord',
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.css'],
})
export class LandlordComponent implements OnInit {
  isSuperUser: boolean = false;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>;

  ConfigForm: FormGroup;
  UserDetails: UserDetailsResposeMap;
  isVerifiedEmail = false;
  constructor(
    private _fireService: DbfirestoreService,
    private _router: Router,
    private DataService: DataService,
    private fb: FormBuilder
  ) {
    let self = this;
    this.DataService.changeLoadingStatus(true);
  }
  PendingBookingList = [];
  AllRoomListRaw = [];
  PendingBookingRoomDetails = [];
  AllRoomData = [];
  selectedRoomData = {};
  LocalStorageUserDetails;
  ngOnInit(): void {
    this.LocalStorageUserDetails = JSON.parse(localStorage.getItem('user'));
    this.init_ConfigForm();
    let self = this;
    this.DataService.isEmailVerified.subscribe((data) => {
      this.isVerifiedEmail = data;
    });

    this.DataService.currentUserFullDetails.subscribe((data: UserDetailsResposeMap) => {
      console.log(data);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      this.UserDetails = {
        email: data.email,
        phone: data.phone,
        Fname: data.Fname,
        Lname: data.Lname,
      };
      let opt = data.email;
      if (opt == 'prazzeettstha@gmail.com') {
        opt = 'ALL';
      }
      this._fireService.getPendingBookingList(opt).then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          self.PendingBookingList.push(doc.data());
        });
        // console.clear();
        console.log(self.PendingBookingList);
        for (let i = 0; i < self.PendingBookingList.length; i++) {
          this._fireService.getSelectedRoom(self.PendingBookingList[i].RoomId).then((data) => {
            console.log(data.data());
            let remodeledData = data.data();
            if (remodeledData) {
              const DataSet = {
                id: remodeledData.id,
                index: i,
                RequestedDate:
                  new Date(self.PendingBookingList[i].dateofBooking.seconds * 1000).getDate().toString() +
                  ' ' +
                  monthNames[new Date(self.PendingBookingList[i].dateofBooking.seconds * 1000).getMonth()].toString() +
                  ', ' +
                  new Date(self.PendingBookingList[i].dateofBooking.seconds * 1000).getFullYear().toString(),
                applicantName: self.PendingBookingList[i].TenantId.name
                  ? self.PendingBookingList[i].TenantId.name
                  : 'Unknown',
                applicantId: self.PendingBookingList[i].TenantId.id,
                like: false,
                url: remodeledData.images.mainPhoto,
                title: (
                  (remodeledData.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + remodeledData.roomType
                ).toUpperCase(),
                subtitle: remodeledData.roomType + ' in ' + remodeledData.location.name,
                location: remodeledData.location.name,
                price: 'Rs. ' + remodeledData.feeDetails.price.toString(),
                date: 'Available from 20th Oct, 2020',
                status: remodeledData.isBooked ? 'Booked' : 'Available',
              };
              console.log(DataSet);
              self.PendingBookingRoomDetails.push(DataSet);
            }
          });
        }
        self.DataService.changeLoadingStatus(false);
        console.log(self.PendingBookingRoomDetails);
      });
    });
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
  pleaseVerifyText = '';
  addRoom() {
    if (this.isVerifiedEmail) {
      this.DataService.changeisEditRoomValue(false);
      this._router.navigate(['/addRoom']);
      this.pleaseVerifyText = '';
    } else {
      this.pleaseVerifyText = 'Please Verify your account before adding any product. Thank you';
    }
  }
  products = [];
  CompileRoomData() {
    this.products = [];
    this.AllRoomData = [];
    this.AllRoomListRaw.forEach((data, index) => {
      const DataSet = {
        id: data.id,
        index: index,
        like: false,
        url: data.images.mainPhoto,
        title: ((data.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + data.roomType).toUpperCase(),
        subtitle: data.roomType + ' in ' + data.location.name,
        location: data.location.name,
        price: 'Rs. ' + data.feeDetails.price.toString(),
        date: 'Available from 20th Oct, 2020',
        status: data.isBooked ? 'Booked' : 'Available',
      };
      this.AllRoomData.push(DataSet);
    });
    // if (this.products.length <= 0) {
    //   this.noResult = true;
    // } else {
    //   this.noResult = false;
    // }
    console.log(this.products);
  }

  addLocation() {}
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    let self = this;
    if (tabChangeEvent.index.toString() == '1') {
      this.AllRoomListRaw = [];
      this.DataService.changeLoadingStatus(true);
      let opt = this.UserDetails.email;
      if (this.UserDetails.email == 'prazzeettstha@gmail.com') {
        opt = 'ALL';
      }
      this.DataService.isSuperUser.subscribe((data: boolean) => {
        this.isSuperUser = data;
        if (this.isSuperUser) {
          this._fireService.getALLROOMLIST().then((data) => {
            data.forEach((doc) => {
              self.AllRoomListRaw.push(doc.data());
            });
            this.CompileRoomData();
            this.DataService.changeLoadingStatus(false);
          });
        } else {
          console.log(':::::NORMAL LANDLORD::::::');
          this._fireService.getCertainLandLordRoomList(this.UserDetails.email).then((data) => {
            console.log(data);
            data.forEach((doc) => {
              self.AllRoomListRaw.push(doc.data());
            });
            this.CompileRoomData();
            this.DataService.changeLoadingStatus(false);
          });
        }
      });
    }
  }
}
