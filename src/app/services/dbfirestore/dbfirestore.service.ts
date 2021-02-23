import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';

import { combineLatest } from 'rxjs';
import { map, finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { roomDetailsTemplate } from '../../interfaces/roomDetails';
import { BookingRequestDataTempalte } from '../../interfaces/bookingRequest';
import { FirestoreQueryService } from '../firestorequery/firestore-query.service';
import { DataService } from '../data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class DbfirestoreService {
  constructor(
    private _notify: NotifierService,
    public fireservice: AngularFirestore,
    public fireStorage: AngularFireStorage,
    private _DataService: DataService,
    private _fireQuery: FirestoreQueryService,
    private _Router: Router
  ) {}

  userCollection = this.fireservice.collection('users');
  roomCollection = this.fireservice.collection('products');
  BookingsCollection = this.fireservice.collection('bookings');
  LocationCollection = this.fireservice.collection('locationdetails');

  registerNewUser(userData, userId: string) {
    return this.userCollection.doc(userId).set(userData);
  }

  getCurrentUserDetails(id) {
    return this.userCollection.doc(id).get();
  }
  uploads: any[];
  allPercentage: Observable<any>;
  files: Observable<any>;
  async getExtraImageUrl(docId, files) {
    // reset the array
    let urlList = [];
    this.uploads = [];
    const filelist = files;
    const allPercentage: Observable<number>[] = [];

    for (const file of filelist) {
      var n = Date.now().toString() + '_' + docId.toString() + file.name.toString();
      const path = `RoomsImages/Extras/${n}`;
      const ref = this.fireStorage.ref(path);
      const task = this.fireStorage.upload(path, file);
      const _percentage$ = task.percentageChanges();
      allPercentage.push(_percentage$);

      // create composed objects with different information. ADAPT THIS ACCORDING to YOUR NEED
      const uploadTrack = {
        fileName: file.name,
        percentage: _percentage$,
      };

      // push each upload into the array
      this.uploads.push(uploadTrack);

      // for every upload do whatever you want in firestore with the uploaded file
      const _t = task.then((f) => {
        f.ref.getDownloadURL().then((url) => {
          urlList.push(url);
        });
      });
    }
    console.log('urllist', urlList);
    console.log('uploads', this.uploads);
    this.allPercentage = combineLatest(allPercentage).pipe(
      map((percentages) => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }
        console.log(result / percentages.length);
      }),
      tap(console.log)
    );

    return urlList;
  }
  downloadURL: Observable<string>;
  fb;

  async addNewRoom(data: roomDetailsTemplate, file, ExtrasFiles) {
    this._DataService.changeLoadingStatus(true);
    const docId = this.fireservice.createId();
    data.id = docId;
    console.log('Wating For the ExtrasImgUrl');
    let extra = [];
    extra = await this.getExtraImageUrl(docId, ExtrasFiles);

    console.log('GOT IT', extra);
    data.images.extras = extra;

    var n = Date.now().toString() + '_' + docId.toString();
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.fireStorage.ref(filePath);
    const task = this.fireStorage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            if (url) {
              this.fb = url;
            }
            data.images.mainPhoto = this.fb;
            this.roomCollection
              .doc(docId)
              .set(data)
              .then((res) => {
                this._DataService.changeLoadingStatus(false);
                this._notify.showNotification(
                  'Your room has been added, Thank you!',
                  'New Room Added!',
                  'success',
                  'right'
                );
              })
              .catch((err) => {
                this._DataService.changeLoadingStatus(false);
                this._notify.showNotification(err.message, 'Failed', 'error', 'right');
              });
          });
        })
      )
      .subscribe();
  }

  getRooms() {
    return this.roomCollection.ref.where('isAvailable', '==', true).get();
  }

  getALLROOMLIST() {
    return this.roomCollection.get().toPromise();
  }

  checkBookingStatus(roomId, TenantId) {
    // console.log(roomId);
    // console.log(TenantId);
    return this.BookingsCollection.ref.where('RoomId', '==', roomId).where('TenantId.id', '==', TenantId).get();
  }
  getSelectedRoom(id) {
    console.log(id);
    return this.roomCollection.doc(id).get().toPromise();
  }

  requestABooking(data: BookingRequestDataTempalte) {
    const docId = this.fireservice.createId();
    data.reqId = docId;
    let self = this;
    this._DataService.changeLoadingStatus(true);
    this._fireQuery
      .getaBookingDoc(data.landLord.phone, data.RoomId, data.TenantId.id)
      .then(function (querySnapshot) {
        let list;
        list = [];

        querySnapshot.forEach(function (doc) {
          list.push(doc.data());
        });
        if (list.length >= 1) {
          self._DataService.changeLoadingStatus(false);
          self._notify.showNotification(
            'You Already Have booked this Room. Please wait for the updates.',
            'Booking Failed',
            'error',
            'left'
          );
        } else if (list.length == 0) {
          self.BookingsCollection.doc(docId)
            .set(data)
            .then((res) => {
              self._DataService.changeLoadingStatus(false);

              self._notify.showNotification(
                'Your Booking has been Succesfully Delivered. Please Wait for few days for the response',
                'Booking Recored',
                'success',
                'left'
              );
              location.reload();
            })
            .catch((err) => {
              self._DataService.changeLoadingStatus(false);

              console.log(err);
              self._notify.showNotification(
                'Something Went Wrong, Please try again in few moment',
                'Booking Failed',
                'error',
                'left'
              );
            });
        }
      })
      .catch((err) => {
        console.log(err);
        self._DataService.changeLoadingStatus(false);

        self._notify.showNotification(
          'Something Went Wrong, Please try again in few moment',
          'Booking Failed',
          'error',
          'left'
        );
      });
  }

  getCertainLandLordRoomList(email: string) {
    console.log(email);
    return this.roomCollection.ref.where('landLordDetails.email', '==', email).get();
  }

  getAllBookingList() {
    return this.BookingsCollection.get().toPromise();
  }

  getPendingBookingList(option: 'ALL' | string) {
    if (option == 'ALL') {
      return this.BookingsCollection.ref.where('status', '==', 'Pending').get();
    } else {
      return this.BookingsCollection.ref.where('status', '==', 'Pending').where('landLord.email', '==', option).get();
    }
  }

  getApprovedBookingList() {
    return this.BookingsCollection.ref.where('status', '==', 'Approved').get();
  }

  getRejectedBookingList() {
    return this.BookingsCollection.ref.where('status', '==', 'Rejected').get();
  }

  TENANT_GET_BOOKEDROOMLIST(userId) {
    return this.BookingsCollection.ref.where('TenantId.id', '==', userId).get();
  }

  getCurrentUserImg(uid) {
    return this.userCollection.ref.where('uid', '==', uid).get();
  }
  addNewLocation(LocationObj) {
    const docId = this.fireservice.createId();
    LocationObj.id = docId;
    return this.LocationCollection.doc(docId).set(LocationObj);
  }

  getLocationsList() {
    return this.LocationCollection.get().toPromise();
  }
  deleteRoom(id, photoList) {
    this.roomCollection
      .doc(id)
      .delete()
      .then((res) => {
        this._notify.showNotification('ROOM DELTED', '', 'success');
        location.reload();
        for (const obj of photoList) {
          var desertRef = this.fireStorage.storage.refFromURL(obj['thumbImage']);
          // Delete the file
          desertRef
            .delete()
            .then(() => {
              console.log('// File deleted successfully');
            })
            .catch((error) => {
              console.log('// Uh-oh, an error occurred!');
            });
        }
      });
  }
}
