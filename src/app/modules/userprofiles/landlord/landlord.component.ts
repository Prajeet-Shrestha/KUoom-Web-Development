import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserDetailsResposeMap } from '../tenant/tenant.component';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';

@Component({
  selector: 'app-landlord',
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.css'],
})
export class LandlordComponent implements OnInit {
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
  isSuperUser: boolean = false;
  ConfigForm: FormGroup;
  UserDetails: UserDetailsResposeMap;
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
  ngOnInit(): void {
    this.init_ConfigForm();
    let self = this;
    this.DataService.isSuperUser.subscribe((data: boolean) => {
      this.isSuperUser = data;
      if (this.isSuperUser) {
        this._fireService.getALLROOMLIST().then((data) => {
          data.forEach((doc) => {
            self.AllRoomListRaw.push(doc.data());
          });
          this.CompileRoomData();
        });
      } else {
        this._fireService.getCertainLandLordRoomList(this.UserDetails.phone.toString()).then((data) => {
          data.forEach((doc) => {
            self.AllRoomListRaw.push(doc.data());
          });
          this.CompileRoomData();
        });
      }
    });

    this.DataService.currentUserFullDetails.subscribe((data: UserDetailsResposeMap) => {
      console.log(data);
      this.UserDetails = {
        email: data.email,
        phone: data.phone,
        Fname: data.Fname,
        Lname: data.Lname,
      };
      let opt = data.phone;
      if (data.phone == '9810442111') {
        opt = 'ALL';
      }

      this._fireService.getPendingBookingList(opt).then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          self.PendingBookingList.push(doc.data());
        });
        for (let i = 0; i < self.PendingBookingList.length; i++) {
          this._fireService.getSelectedRoom(self.PendingBookingList[i].RoomId).then((data) => {
            let remodeledData = data.data();
            const DataSet = {
              id: remodeledData.id,
              index: i,
              like: false,
              url: remodeledData.images.mainPhoto,
              title: (
                (remodeledData.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + remodeledData.roomType
              ).toUpperCase(),
              subtitle: 'Single Room in ' + remodeledData.location,
              location: remodeledData.location,
              price: 'Rs. ' + remodeledData.feeDetails.price.toString(),
              date: 'Available from 20th Oct, 2020',
              status: remodeledData.isBooked ? 'Booked' : 'Available',
            };

            self.PendingBookingRoomDetails.push(DataSet);
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

  addRoom() {
    this._router.navigate(['/addRoom']);
  }

  CompileRoomData() {
    this.products = [];
    this.AllRoomListRaw.forEach((data, index) => {
      const DataSet = {
        id: data.id,
        index: index,
        like: false,
        url: data.images.mainPhoto,
        title: ((data.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + data.roomType).toUpperCase(),
        subtitle: 'Single Room in ' + data.location,
        location: data.location,
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
}
