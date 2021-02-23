import { Component, OnInit } from '@angular/core';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSingleDateSelectionModel } from '@angular/material/datepicker';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  searchBarStatus: boolean;
  FilterAvailableDateForm: FormGroup;
  constructor(private _router: Router, private dataService: DataService, private _formBuilder: FormBuilder) {}
  lang: string = 'en';
  ngOnInit(): void {
    this.dataService.changeTitle('KUoom | Find Your Room');
    this.dataService.currentlang.subscribe((data) => {
      this.lang = data;
    });
    this.dataService.currentremoveIndexSearchBar.subscribe((data) => {
      // console.log(data);
      this.searchBarStatus = data;
    });

    this.FilterAvailableDateForm = this._formBuilder.group({
      date: [false, Validators.required],
    });
  }

  search() {
    this.dataService.changeIndexDateFilter(this.FilterAvailableDateForm.value.date);
    this._router.navigate([Url_SuperPath['SearchRoom']]);
  }

  datechange(e) {
    console.log(e.target);
    console.log(this.FilterAvailableDateForm.value.date);
  }
  translate(val: 'en' | 'np') {
    this.lang = val;
    this.dataService.changeLang(val);
  }
}
