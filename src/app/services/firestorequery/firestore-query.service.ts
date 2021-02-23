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

  ApplyFilter(filterObj: FilterDataTemplate) {
    console.log(filterObj);
    var query = this.roomCollection.ref.where('isAvailable', '==', true);

    if (filterObj.availableDate) {
      query = query.where('availableDate.dateObject', '>=', filterObj.availableDate);
    }
    if (
      filterObj.maxPrice == 0 &&
      filterObj.availableDate == '' &&
      filterObj.roomType.length <= 0 &&
      filterObj.service.length <= 0 &&
      filterObj.availableDate
    ) {
      console.log('NO FILTER ');
      return query.get();
    }
    if (filterObj.maxPrice != 0) {
      query = query.where('feeDetails.price', '<=', filterObj.maxPrice);
    }

    if (filterObj.roomType.length >= 0) {
      if (filterObj.roomType.includes('Private Room')) {
        query = query.where('roomType', '==', 'Private Room');
      }
      if (filterObj.roomType.includes('Shared Room')) {
        query = query.where('roomType', '==', 'Shared Room');
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
      if (filterObj.service.includes('WiFi')) {
        query = query.where('feeDetails.wifi', '==', true);
      }
      if (filterObj.service.includes('Balcony')) {
        query = query.where('facilities.terrance', '==', true);
      }
      if (filterObj.service.includes('Air Conditioning')) {
        query = query.where('facilities.AC', '==', true);
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

  UpdateUserInfo(id, userObj) {
    return this.userCollection.doc(id).update(userObj);
  }

  getLandLordImg(email) {
    return this.userCollection.ref.where('email', '==', email).get();
  }
}
