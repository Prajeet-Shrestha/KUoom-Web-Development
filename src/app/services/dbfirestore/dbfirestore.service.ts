import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { roomDetailsTemplate } from '../../interfaces/roomDetails';
import { BookingRequestDataTempalte } from '../../interfaces/bookingRequest';
import { FirestoreQueryService } from '../firestorequery/firestore-query.service';
import { DataService } from '../data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
@Injectable({
  providedIn: 'root',
})
export class DbfirestoreService {
  constructor(
    private _notify: NotifierService,
    public fireservice: AngularFirestore,
    public fireStorage: AngularFireStorage,
    private _DataService: DataService,
    private _fireQuery: FirestoreQueryService
  ) {}

  userCollection = this.fireservice.collection('users');
  roomCollection = this.fireservice.collection('products');
  BookingsCollection = this.fireservice.collection('bookings');

  registerNewUser(userData, userId: string) {
    return this.userCollection.doc(userId).set(userData);
  }

  getCurrentUserDetails(id) {
    return this.userCollection.doc(id).get();
  }

  downloadURL: Observable<string>;
  fb;
  addNewRoom(data: roomDetailsTemplate, file) {
    this._DataService.changeLoadingStatus(true);
    const docId = this.fireservice.createId();
    data.id = docId;

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

  getCertainLandLordRoomList(phone: string) {
    return this.roomCollection.ref.where('LandLordDetails.phone', '==', phone).get();
  }

  getAllBookingList() {
    return this.BookingsCollection.get().toPromise();
  }

  getPendingBookingList(option: 'ALL' | string) {
    if (option == 'ALL') {
      return this.BookingsCollection.ref.where('status', '==', 'Pending').get();
    } else {
      return this.BookingsCollection.ref.where('status', '==', 'Pending').where('landLord.phone', '==', option).get();
    }
  }

  getApprovedBookingList() {
    return this.BookingsCollection.ref.where('status', '==', 'Approved').get();
  }

  getRejectedBookingList() {
    return this.BookingsCollection.ref.where('status', '==', 'Rejected').get();
  }
}
