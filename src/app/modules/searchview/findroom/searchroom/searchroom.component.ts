import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { Observable, Observer } from 'rxjs';
import { DataService } from '../../../../services/data.service';
import { DbfirestoreService } from '../../../../services/dbfirestore/dbfirestore.service';
import { FilterDataTemplate } from '../../../../interfaces/filterDataTemplate';
import { FirestoreQueryService } from '../../../../services/firestorequery/firestore-query.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  FilterAvailableDateForm: FormGroup;
  paginationState = {
    prevPage: 1,
    page: 1,
    displaySize: 3,
    totalPage: 1,
    totalSize: 0,
  };
  AllRoomData = [];
  FilterAvailableDateFormMobile: FormGroup;
  SELECTEDFILTERS: FilterDataTemplate = {
    availableDate: false,
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
    private _fireService: DbfirestoreService,
    private _formBuilder: FormBuilder
  ) {
    let self = this;
    this._DataService.changeLoadingStatus(true);
    this._DataService.indexDateFilter.subscribe((res) => {
      if (res) {
        this.SelectedFilters.push(res.toDateString());
        this.currentDate = res.toDateString();
        this.SELECTEDFILTERS.availableDate = res;
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
      } else {
        this._fireService.getRooms().then((querySnapshot) => {
          let list = [];
          querySnapshot.forEach(function (doc) {
            list.push(doc.data());
          });
          this.paginationState.totalSize = list.length;
          this.paginationState.totalPage = Math.ceil(list.length / this.paginationState.displaySize);
          console.log(this.paginationState);
          // self.paginationState.lastDoc = self.AllRoomData[-1];
          // this.CompileRoomData();
        });
        this.getRoomDetails();
      }
      this._DataService.changeLoadingStatus(false);
    });
  }
  getRoomDetails() {
    let self = this;
    this.AllRoomData = [];
    this._DataService.changeLoadingStatus(true);

    this._fireService
      .getRoomUsingPagination(
        this.paginationState.page,
        this.paginationState['lastDoc'],
        this.paginationState.prevPage,
        this.paginationState['firstDoc'],
        this.paginationState.displaySize
      )
      .then((querySnapshot) => {
        this.paginationState['lastDoc'] = querySnapshot.docs[querySnapshot.docs.length - 1];
        this.paginationState['firstDoc'] = querySnapshot.docs[0];
        querySnapshot.forEach(function (doc) {
          self.AllRoomData.push(doc.data());
        });
        // self.paginationState.lastDoc = self.AllRoomData[-1];
        this._DataService.changeLoadingStatus(false);

        self.CompileRoomData();
      });
  }
  currentDate: string = '';
  datechange() {
    let self = this;
    console.log(window.innerWidth.toString());
    if (this.FilterAvailableDateForm.value.date && !this.FilterAvailableDateFormMobile.value.date) {
      if (this.FilterAvailableDateForm.value.date) {
        try {
          console.log(this.SelectedFilters);
          console.log(this.SelectedFilters.indexOf(this.currentDate));
          this.SelectedFilters.splice(this.SelectedFilters.indexOf(this.currentDate), 1);
        } catch (e) {
          console.log(e);
        }
        this.SelectedFilters.push(this.FilterAvailableDateForm.value.date.toDateString());
        this.currentDate = this.FilterAvailableDateForm.value.date.toDateString();
        this.SELECTEDFILTERS.availableDate = this.FilterAvailableDateForm.value.date;
      }
    } else if (this.FilterAvailableDateFormMobile.value.date && !this.FilterAvailableDateForm.value.date) {
      if (this.FilterAvailableDateFormMobile.value.date) {
        try {
          console.log(this.SelectedFilters);
          console.log(this.SelectedFilters.indexOf(this.currentDate));
          this.SelectedFilters.splice(this.SelectedFilters.indexOf(this.currentDate), 1);
        } catch (e) {
          console.log(e);
        }
        this.SelectedFilters.push(this.FilterAvailableDateFormMobile.value.date.toDateString());
        this.currentDate = this.FilterAvailableDateFormMobile.value.date.toDateString();
        this.SELECTEDFILTERS.availableDate = this.FilterAvailableDateFormMobile.value.date;
      }
    } else {
      location.reload();
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
  }
  ngAfterViewInit() {
    let randomNotificationColor = ['#037ef3', '#00c16e', '#f85a40', '#ff5757'];
    var random_color = randomNotificationColor[Math.floor(Math.random() * randomNotificationColor.length)];
    var elem = <HTMLInputElement>document.getElementById('midNotification');
    elem.style.backgroundColor = random_color;
    console.log(elem);
  }
  ShowMaxPrice;
  ngOnInit(): void {
    this._DataService.changeTitle('Search Room | KUoom');
    this._DataService.currentMaxPrice.subscribe((price) => {
      this.ShowMaxPrice = price;
    });

    this.FilterAvailableDateForm = this._formBuilder.group({
      date: [false, Validators.required],
    });
    this.FilterAvailableDateFormMobile = this._formBuilder.group({
      date: [false, Validators.required],
    });
  }

  updatelike(product) {
    console.log(this.FilterAvailableDateForm.value);
    if (product.like) {
      product.like = false;
    } else {
      product.like = true;
    }
  }

  RoomProfileNavigate(productObj) {
    // console.log(productObj);
    // this.CompileRoomData();
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
  FilterMode: boolean = false;
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
      //this is for the money
      this._DataService.changeMaxPriceInSearch(event.value);
      this.SELECTEDFILTERS.maxPrice = event.value;
      for (let i = 0; i < this.SelectedFilters.length; i++) {
        if (this.SelectedFilters[i].slice(0, 2) == 'Rs') {
          this.SelectedFilters.splice(i, 1);
        }
      }
      this.SelectedFilters.push('Rs.' + event.value.toString());
    }
    this.paginationState = {
      prevPage: 1,
      page: 1,
      displaySize: 3,
      totalPage: 1,
      totalSize: 0,
    };
    if (
      this.SELECTEDFILTERS.maxPrice == 0 &&
      this.SELECTEDFILTERS.roomType.length <= 0 &&
      this.SELECTEDFILTERS.service.length <= 0 &&
      this.SELECTEDFILTERS.verification.length <= 0
    ) {
      this.FilterMode = false;
      console.log('::::::::FILETED MODE OFF:::::');
      this._fireService.getRooms().then((querySnapshot) => {
        let list = [];
        querySnapshot.forEach(function (doc) {
          list.push(doc.data());
        });
        this.paginationState.totalSize = list.length;
        this.paginationState.totalPage = Math.ceil(list.length / this.paginationState.displaySize);
        console.log(this.paginationState);
        // self.paginationState.lastDoc = self.AllRoomData[-1];
        // this.CompileRoomData();
      });
      this.getRoomDetails();
    } else {
      this.FilterMode = true;
      console.log('::::::::FILETED MODE ON:::::');

      this.FilterRoom();
    }
    console.log(this.SELECTEDFILTERS);
  }
  FilterRoom() {
    let self = this;
    this._fireQuery
      .ApplyFilter(this.SELECTEDFILTERS)
      .then(function (querySnapshot) {
        self.AllRoomData = [];
        querySnapshot.forEach(function (doc) {
          self.AllRoomData.push(doc.data());
        });
        self.paginationState.totalSize = self.AllRoomData.length;
        self.paginationState.totalPage = Math.ceil(self.AllRoomData.length / self.paginationState.displaySize);

        self.CompileRoomData();
        console.log(self.paginationState);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  FilteredProduct = [];
  CompileRoomData() {
    this.products = [];
    let self = this;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    this.AllRoomData.forEach((data, index) => {
      let imageObject = [];
      // let date =
      //   ' Available from ' +
      //   new Date(data.availableDate.seconds * 1000).getDate().toString() +
      //   ' ' +
      //   monthNames[data.availableDate.getMonth()].toString() +
      //   ', ' +
      //   data.availableDate.getFullYear().toString();
      // console.log(new Date(data.availableDate.seconds * 1000));
      imageObject.push({
        thumbImage: data.images.mainPhoto,
      });
      if (data.images.extras) {
        for (const url of data.images.extras) {
          imageObject.push({
            thumbImage: url,
          });
        }
      }

      const DataSet = {
        id: data.id,
        index: index,
        like: false,
        isChecked: data.isChecked ? true : false,
        url: data.images.mainPhoto,
        imgObjects: imageObject,
        title: ((data.furnishedDetails.isFurnished ? 'Furnished ' : 'Unfurnished ') + data.roomType).toUpperCase(),
        subtitle: data.roomType + ' in ' + data.location.name,
        location: data.location.name,
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
        status: data.isAvailable ? 'Available' : 'Booked',
      };
      if (this.FilterMode) {
        this.FilteredProduct.push(DataSet);
      } else {
        this.products.push(DataSet);
      }
    });
    if (this.FilterMode) {
      this.products = this.FilteredProduct.slice(
        this.paginationState.page - 1,
        this.paginationState.page + this.paginationState.displaySize - 1
      );
    }
    if (this.products.length <= 0) {
      this.noResult = true;
    } else {
      this.noResult = false;
    }
    console.log(this.products);
  }

  nextPage() {
    // if (this.paginationState.page < this.paginationState.totalPage)
    this.paginationState.prevPage = this.paginationState.page;
    this.paginationState.page = this.paginationState.page + 1;
    // this.paginationState.lastDoc = this.AllRoomData[this.AllRoomData.length - 1];
    console.log(this.paginationState);
    if (this.FilterMode) {
      console.log(this.paginationState);
      let first = this.paginationState.prevPage * this.paginationState.displaySize;
      console.log(first);
      this.products = this.FilteredProduct.slice(first, first + this.paginationState.displaySize);
    } else {
      this.getRoomDetails();
    }
  }
  prevPage() {
    this.paginationState.prevPage = this.paginationState.page;
    this.paginationState.page = this.paginationState.page - 1;
    // this.paginationState.lastDoc = this.AllRoomData[this.AllRoomData.length - 1];
    console.log(this.paginationState);
    if (this.FilterMode) {
      console.log(this.paginationState);
      let last = this.paginationState.prevPage * this.paginationState.displaySize - this.paginationState.displaySize;
      // console.log(first);
      this.products = this.FilteredProduct.slice(last - this.paginationState.displaySize, last);
    } else {
      this.getRoomDetails();
    }
  }
}
