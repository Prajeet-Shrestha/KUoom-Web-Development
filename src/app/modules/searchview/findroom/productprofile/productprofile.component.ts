import { Component, OnInit, AfterViewInit } from '@angular/core';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { DataService } from '../../../../services/data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
import { DbfirestoreService } from '../../../../services/dbfirestore/dbfirestore.service';
import { Router } from '@angular/router';
import { BookingRequestDataTempalte } from '../../../../interfaces/bookingRequest';
import { roomDetailsTemplate } from '../../../../interfaces/roomDetails';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreQueryService } from 'src/app/services/firestorequery/firestore-query.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-productprofile',
  templateUrl: './productprofile.component.html',
  styleUrls: ['./productprofile.component.css'],
})
export class ProductprofileComponent implements OnInit, AfterViewInit {
  accomodatioPoliciesList = [
    {
      policies:
        'After book, the room will be in reserved for 10 Days. If the student is unable to pay or occupy the room the booking shall be deemed void.',
    },
    {
      policies: 'Student can cancel the booking within 15 days after booking.',
    },
  ];
  LandlordDetails = [];
  LandlordImgtrue = false;
  BOOKEDDATA: object;
  UsableEmbbedCode: SafeResourceUrl;
  constructor(
    private _notify: NotifierService,
    private _router: Router,
    private _DS: DataService,
    public sanitizeURL: DomSanitizer,
    private fireauth: AngularFireAuth,
    private _fireQuery: FirestoreQueryService,
    private _fireService: DbfirestoreService
  ) {
    this.userdetails = JSON.parse(localStorage.getItem('user'));
    this._DS.changeLoadingStatus(true);
    // console.log();
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
          isChecked: remodeledData.isChecked ? remodeledData.isChecked : false,
          capacity: remodeledData.capacity ? remodeledData.capacity : 'Unavailable',
          policies: remodeledData.policies,
          basicQA: remodeledData.basicQA,
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

        if (this.selectedRoomData.isAvailable) {
          this._fireService
            .checkBookingStatus(this.selectedRoomData.id, this.userdetails.uid)
            .then(function (querySnapshot) {
              let list;
              list = [];
              querySnapshot.forEach(function (doc) {
                list.push(doc.data());
              });
              console.log(list[0]);
              if (list.length >= 1) {
                self.isBookedbyuser = true;
                self.BOOKEDDATA = list[0];
                // console.log(this.BOOKEDDATA);
              } else if (list.length == 0) {
                self.isBookedbyuser = false;
              }
              console.log('ISBOOKED?::', self.isBookedbyuser);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.isStatusBooked = true;
        }
        try {
          if (this.selectedRoomData.location.url.includes('www.google.com')) {
            this.UsableEmbbedCode = this.sanitizeURLFunction(this.selectedRoomData.location.url);
            console.log(this.UsableEmbbedCode);
            this.mapError = false;
          } else {
            console.error(':::INVALID GOOGLE MAP CODE:::::');
            this.mapError = true;
          }
        } catch (e) {
          console.error(':::INVALID GOOGLE MAP CODE:::::');
          this.mapError = true;
        }
        this._fireQuery.getLandLordImg(this.selectedRoomData.landLordDetails.email).then((res) => {
          res.forEach(function (doc) {
            self.LandlordDetails.push(doc.data());
          });
          console.log(self.LandlordDetails);
          if (self.LandlordDetails.length >= 1) {
            if (self.LandlordDetails[0].imgUrl.length >= 2) {
              self.LandlordImgtrue = true;
            }
          }
        });
        self._DS.changeLoadingStatus(false);
        console.log(remodeledData);
        console.log(self.selectedRoomData);
        if (this.selectedRoomData.policies) {
          this.accomodatioPoliciesList = this.selectedRoomData.policies;
        }
        self.imageObject.push({
          image: self.selectedRoomData.images.mainPhoto,
          thumbImage: self.selectedRoomData.images.mainPhoto,
          alt: 'alt of image',
          title: 'FURNISHED PRIVATE ROOM',
        });
        if (this.selectedRoomData.images.extras) {
          for (const url of this.selectedRoomData.images.extras) {
            self.imageObject.push({
              image: url,
              thumbImage: url,
              alt: 'alt of image',
              title: 'FURNISHED PRIVATE ROOM',
            });
          }
        }
      });
    });
  }
  isStatusBooked: boolean = false;
  imageObject: Array<object> = [];
  selectedRoomId: string = '';
  isSuperUser: boolean = false;
  isBookedbyuser: boolean = false;
  userdetails;
  selectedRoomData: roomDetailsTemplate = {
    id: '',
    policies: [
      {
        policies: '',
      },
    ],
    isChecked: false,
    basicQA: [],
    capacity: 0,
    isAvailable: true,
    location: {
      name: '',
      url: '',
    },
    availableDate: null,
    roomType: '',
    // isBooked: false,
    description: '',
    landLordDetails: {
      fullName: '',
      email: '',
      phone: '',
      isTrusted: false,
      img: '',
    },

    facilities: {
      AC: false,
      laundary: false,
      terrance: false,
      wifi: false,
    },

    feeDetails: {
      price: '',
      electricBill: false,
      laundary: false,
      meals: false,
      roomSpace: false,
      wifi: false,
    },

    images: {
      mainPhoto: '',
      extras: [],
    },

    furnishedDetails: {
      isFurnished: false,
      objects: {
        hasChair: false,
        hasDesk: false,
        hasBed: false,
        hasCupBoard: false,
      },
    },
  };
  UserType = '';
  isVerified: boolean = false;

  ngAfterViewInit() {}
  ngOnInit(): void {
    this.fireauth.onAuthStateChanged((res) => {
      console.log(res);

      if (res) {
        if (res.emailVerified) {
          this._DS.isEmailVerifiedStatus(true);
        }
        // console.log(res.emailVerified);
      }
    });
    this._DS.isSuperUser.subscribe((res) => {
      console.warn(':::IS SUPER USER:::::', res);
      this.isSuperUser = res;
    });
    this._DS.changeTitle('Product | KUoom');
    this._DS.currentuserType.subscribe((type) => {
      this.UserType = type;
    });
    this._DS.isEmailVerified.subscribe((stat) => {
      this.isVerified = stat;
      console.log('ISVERIFIED:::', this.isVerified);
    });
  }
  REQUESTBOOKING() {
    if (this.isVerified) {
      let bookingData: BookingRequestDataTempalte = {
        reqId: '',
        RoomId: this.selectedRoomData.id,
        landLord: {
          email: this.selectedRoomData.landLordDetails.email,
          phone: this.selectedRoomData.landLordDetails.phone,
        },
        TenantId: {
          email: this.userdetails.email,
          name: this.userdetails.name,
          id: this.userdetails.uid,
        },
        dateofBooking: new Date(),
        status: 'Pending',
      };
      this._fireService.requestABooking(bookingData);
    } else {
      this._notify.showNotification('Please Verify Your Email Before Booking.', '', 'error');
    }
  }
  mapError = false;
  sanitizeURLFunction(url): SafeResourceUrl {
    return this.sanitizeURL.bypassSecurityTrustResourceUrl(url);
  }

  unbook() {
    const unBookReqData = {
      RoomId: this.BOOKEDDATA['reqId'],
    };

    this._fireService
      .deleteABooking(unBookReqData.RoomId)
      .then((res) => {
        console.log(res);
        let url = this._router.url;
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate([url]);
        });
        this._notify.showNotification('THE ROOM HAS BEEN UNBOOKED', '', 'success', 'left');
      })
      .catch((err) => {
        console.log(err);
        this._notify.showNotification('OPPS! Something went wrong!', 'Please Try Again', 'error');
      });
  }
}
