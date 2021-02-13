import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { Observable, Observer } from 'rxjs';
import { DataService } from '../../../../services/data.service';
import { DbfirestoreService } from '../../../../services/dbfirestore/dbfirestore.service';
import { FilterDataTemplate } from '../../../../interfaces/filterDataTemplate';
import { FirestoreQueryService } from '../../../../services/firestorequery/firestore-query.service';

export interface room {
  index: number;
  like: boolean;
  url: string;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-searchroom',
  templateUrl: './searchroom.component.html',
  styleUrls: ['./searchroom.component.css'],
})
export class SearchroomComponent implements OnInit {
  SelectedFilters = [];
  noResult: boolean = false;
  SELECTEDFILTERS: FilterDataTemplate = {
    availableDate: '',
    maxPrice: 0,
    roomType: [],
    service: [],
    verification: [],
  };
  products = [];
  constructor(
    private _fireQuery: FirestoreQueryService,
    private _router: Router,
    private _DataService: DataService,
    private _fireService: DbfirestoreService
  ) {
    this._fireQuery.filter();
    let self = this;
    this._DataService.changeLoadingStatus(true);
    this._fireService.getRooms().then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        self.AllRoomData.push(doc.data());
      });
      this._DataService.changeLoadingStatus(false);
      this.CompileRoomData();
    });
  }
  AllRoomData = [];
  ngAfterViewInit() {}
  ShowMaxPrice;
  ngOnInit(): void {
    this._DataService.changeTitle('Search Room | KUoom');
    this._DataService.currentMaxPrice.subscribe((price) => {
      this.ShowMaxPrice = price;
    });
  }

  updatelike(product) {
    if (product.like) {
      product.like = false;
    } else {
      product.like = true;
    }
  }

  RoomProfileNavigate(productObj) {
    // console.log(productObj);
    this.CompileRoomData();
    this._router.navigate([Url_SuperPath['ProductProfile'], productObj.id]);
  }
  price = 3000;

  MaxPrice = 0;

  PriceRangeformatLabel(value: number) {
    this.MaxPrice = value;
    // console.log(this.MaxPrice);
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
  }

  UpdateSelectedFilter(event, type) {
    let self = this;
    if (event.checked) {
      this.SelectedFilters.push(event.source.value);
      if (type == 'roomType') {
        this.SELECTEDFILTERS.roomType.push(event.source.value);
      } else if (type == 'service') {
        this.SELECTEDFILTERS.service.push(event.source.value);
      }
    } else if (event.checked == false) {
      this.SelectedFilters.splice(this.SelectedFilters.indexOf(event.source.value), 1);

      if (type == 'roomType') {
        this.SELECTEDFILTERS.roomType.splice(this.SELECTEDFILTERS.roomType.indexOf(event.source.value), 1);
      } else if (type == 'service') {
        this.SELECTEDFILTERS.service.splice(this.SELECTEDFILTERS.service.indexOf(event.source.value), 1);
      }
    } else {
      this._DataService.changeMaxPriceInSearch(event.value);
      this.SELECTEDFILTERS.maxPrice = event.value;
      for (let i = 0; i < this.SelectedFilters.length; i++) {
        if (this.SelectedFilters[i].slice(0, 2) == 'Rs') {
          this.SelectedFilters.splice(i, 1);
        }
      }
      this.SelectedFilters.push('Rs.' + event.value.toString());
    }
    this._fireQuery
      .ApplyFilter(this.SELECTEDFILTERS)
      .then(function (querySnapshot) {
        self.AllRoomData = [];
        querySnapshot.forEach(function (doc) {
          self.AllRoomData.push(doc.data());
        });
        self.CompileRoomData();
        // console.log(querySnapshot);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.SELECTEDFILTERS);
  }

  CompileRoomData() {
    this.products = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    this.AllRoomData.forEach((data, index) => {
      // let date =
      //   ' Available from ' +
      //   new Date(data.availableDate.seconds * 1000).getDate().toString() +
      //   ' ' +
      //   monthNames[data.availableDate.getMonth()].toString() +
      //   ', ' +
      //   data.availableDate.getFullYear().toString();
      // console.log(new Date(data.availableDate.seconds * 1000));
      const DataSet = {
        id: data.id,
        index: index,
        like: false,
        url: data.images.mainPhoto,
        title: ((data.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + data.roomType).toUpperCase(),
        subtitle: 'Single Room in ' + data.location,
        location: data.location,
        objects: data.furnishedDetails.objects,
        capacity: data.capacity ? data.capacity : null,
        price: 'Rs. ' + data.feeDetails.price.toString(),
        date: data.availableDate
          ? ' Available from ' +
            new Date(data.availableDate.dateObject.seconds * 1000).getDate().toString() +
            ' ' +
            monthNames[new Date(data.availableDate.dateObject.seconds * 1000).getMonth()].toString() +
            ', ' +
            new Date(data.availableDate.dateObject.seconds * 1000).getFullYear().toString()
          : 'Date is Unavailable',
        status: data.isBooked ? 'Booked' : 'Available',
      };
      this.products.push(DataSet);
    });
    if (this.products.length <= 0) {
      this.noResult = true;
    } else {
      this.noResult = false;
    }
    console.log(this.products);
  }
}
