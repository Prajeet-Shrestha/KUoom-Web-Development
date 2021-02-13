import { Component, OnInit, AfterViewInit } from '@angular/core';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { DataService } from '../../../../services/data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
import { DbfirestoreService } from '../../../../services/dbfirestore/dbfirestore.service';
import { Router } from '@angular/router';
import { BookingRequestDataTempalte } from '../../../../interfaces/bookingRequest';
import { roomDetailsTemplate } from '../../../../interfaces/roomDetails';
@Component({
  selector: 'app-productprofile',
  templateUrl: './productprofile.component.html',
  styleUrls: ['./productprofile.component.css'],
})
export class ProductprofileComponent implements OnInit, AfterViewInit {
  constructor(
    private _notify: NotifierService,
    private _router: Router,
    private _DS: DataService,
    private _fireService: DbfirestoreService
  ) {
    this.userdetails = JSON.parse(localStorage.getItem('user'));
    this._DS.changeLoadingStatus(true);
    let self = this;
    this._DS.currentroomIdSource.subscribe((data) => {
      self.selectedRoomId = data;
      if (self.selectedRoomId === null || self.selectedRoomId.length <= 0) {
        self.selectedRoomId = self._router.url.split(Url_SuperPath['ProductProfile'] + '/')[1];
      }
      this._fireService.getSelectedRoom(self.selectedRoomId).then((data) => {
        let remodeledData = data.data();
        this.selectedRoomData = {
          id: remodeledData.id,
          availableDate: remodeledData.availableDate,
          isAvailable: remodeledData.isAvailable,
          capacity: remodeledData.capacity ? remodeledData.capacity : 'Unavailable',
          policies: remodeledData.policies,
          basicQA: remodeledData.basicQA,
          isBooked: remodeledData.isBooked ? true : false,
          location: remodeledData.location,
          roomType: remodeledData.roomType,
          description: remodeledData.description ? remodeledData.description : '',
          landLordDetails: {
            fullName: remodeledData.landLordDetails.fullName,
            email: remodeledData.landLordDetails.email,
            phone: remodeledData.landLordDetails.phone,
            isTrusted: remodeledData.landLordDetails.isTrusted,
            img: remodeledData.landLordDetails.img,
          },

          facilities: remodeledData.facilities,

          feeDetails: remodeledData.feeDetails,

          images: {
            mainPhoto: remodeledData.images.mainPhoto,
            extras: remodeledData.images.extras,
          },

          furnishedDetails: {
            isFurnished: remodeledData.furnishedDetails.isFurnished,
            objects: remodeledData.furnishedDetails.objects,
          },
        };
        this._fireService
          .checkBookingStatus(this.selectedRoomData.id, this.userdetails.uid)
          .then(function (querySnapshot) {
            let list;
            list = [];
            querySnapshot.forEach(function (doc) {
              list.push(doc.data());
            });
            console.log(list);
            if (list.length >= 1) {
              self.isBookedbyuser = true;
            } else if (list.length == 0) {
              self.isBookedbyuser = false;
            }
            console.log('ISBOOKED?::', self.isBookedbyuser);
          })
          .catch((err) => {
            console.log(err);
          });
        self._DS.changeLoadingStatus(false);
        console.log(remodeledData);
        console.log(self.selectedRoomData);
        self.imageObject.push({
          image: self.selectedRoomData.images.mainPhoto,
          thumbImage: self.selectedRoomData.images.mainPhoto,
          alt: 'alt of image',
          title: 'FURNISHED PRIVATE ROOM',
        });
      });
    });
  }
  imageObject: Array<object> = [];
  selectedRoomId: string = '';
  isBookedbyuser: boolean = false;
  userdetails;
  selectedRoomData: roomDetailsTemplate = {
    id: '',
    policies: [],
    basicQA: [],
    capacity: 0,
    isAvailable: true,
    location: '',
    availableDate: null,
    roomType: '',
    isBooked: false,
    description: '',
    landLordDetails: {
      fullName: '',
      email: '',
      phone: '',
      isTrusted: false,
      img: '',
    },

    facilities: [],

    feeDetails: {
      price: '',
    },

    images: {
      mainPhoto: '',
      extras: [],
    },

    furnishedDetails: {
      isFurnished: false,
      objects: {},
    },
  };

  ngAfterViewInit() {}
  ngOnInit(): void {
    this._DS.changeTitle('Product | KUoom');
  }
  REQUESTBOOKING() {
    let bookingData: BookingRequestDataTempalte = {
      reqId: '',
      RoomId: this.selectedRoomData.id,
      landLord: {
        email: this.selectedRoomData.landLordDetails.email,
        phone: this.selectedRoomData.landLordDetails.phone,
      },
      TenantId: {
        email: this.userdetails.email,
        id: this.userdetails.uid,
      },
      dateofBooking: new Date(),
      status: 'Pending',
    };
    this._fireService.requestABooking(bookingData);
  }
}
