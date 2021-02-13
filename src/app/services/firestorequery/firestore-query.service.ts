import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterDataTemplate } from '../../interfaces/filterDataTemplate';
import { DataService } from '../data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreQueryService {
  constructor(
    private _notify: NotifierService,
    public fireservice: AngularFirestore,
    public fireStorage: AngularFireStorage,
    private _DataService: DataService
  ) {}

  userCollection = this.fireservice.collection('users');
  roomCollection = this.fireservice.collection('products');
  bookingsCollection = this.fireservice.collection('bookings');

  filter() {
    console.log('filtering');
    // this.roomCollection.ref
    //   .where('feeDetails.price', '==', '20000')
    //   .get()
    //   .then(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //       // doc.data() is never undefined for query doc snapshots
    //       console.log(doc.id, ' => ', doc.data());
    //     });
    //   });
  }

  ApplyFilter(filterObj: FilterDataTemplate) {
    console.log(filterObj);
    var query = this.roomCollection.ref.limit(10);
    if (
      filterObj.maxPrice == 0 &&
      filterObj.availableDate == '' &&
      filterObj.roomType.length <= 0 &&
      filterObj.service.length <= 0
    ) {
      return this.roomCollection.get().toPromise();
    }
    if (filterObj.maxPrice != 0) {
      query = query.where('feeDetails.price', '<=', filterObj.maxPrice);
    }

    if (filterObj.roomType.length >= 0) {
      if (filterObj.roomType.includes('Private Room')) {
        query = query.where('roomType', '==', 'Shared Private Room');
      }
      if (filterObj.roomType.includes('Entire Flat')) {
        query = query.where('roomType', '==', 'Flat');
      }
    }

    if (filterObj.service.length >= 0) {
      if (filterObj.service.includes('Meals')) {
        query = query.where('feeDetails.meals', '==', true);
      }
      if (filterObj.service.includes('Laundry')) {
        query = query.where('facilities.laundary', '==', true);
      }
    }

    return query.get();
  }

  filterPriceRange(maxPrice: number) {
    console.log('filtering:', maxPrice);
    return this.roomCollection.ref.where('feeDetails.price', '<', maxPrice).get();
  }

  getaBookingDoc(LandlordPhone, roomId, TenantId) {
    return this.bookingsCollection.ref
      .where('landLord.phone', '==', LandlordPhone)
      .where('RoomId', '==', roomId)
      .where('TenantId.id', '==', TenantId)
      .get();
  }
}
