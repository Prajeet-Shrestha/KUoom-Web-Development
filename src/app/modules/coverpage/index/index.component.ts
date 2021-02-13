import { Component, OnInit } from '@angular/core';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  searchBarStatus: boolean;
  constructor(private _router: Router, private dataService: DataService) {}
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
  }

  search() {
    this._router.navigate([Url_SuperPath['SearchRoom']]);
  }

  translate(val: 'en' | 'np') {
    this.lang = val;
    this.dataService.changeLang(val);
  }
}
