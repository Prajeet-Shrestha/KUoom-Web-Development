import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserDetailsResposeMap } from '../tenant/tenant.component';
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

  ConfigForm: FormGroup;
  UserDetails: UserDetailsResposeMap;
  constructor(private _router: Router, private DataService: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.init_ConfigForm();
    this.DataService.currentUserFullDetails.subscribe((data: UserDetailsResposeMap) => {
      console.log(data);
      this.UserDetails = {
        email: data.email,
        phone: data.phone,
        Fname: data.Fname,
        Lname: data.Lname,
      };
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
    return 0;
  }
}
