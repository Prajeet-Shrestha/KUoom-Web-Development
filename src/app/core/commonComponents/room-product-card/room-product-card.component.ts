import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import { FirestoreQueryService } from 'src/app/services/firestorequery/firestore-query.service';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';

@Component({
  selector: 'app-room-product-card',
  templateUrl: './room-product-card.component.html',
  styleUrls: ['./room-product-card.component.css'],
})
export class RoomProductCardComponent implements OnInit {
  constructor(
    private _fireQuery: FirestoreQueryService,
    private _router: Router,
    private _DataService: DataService,
    private _fireService: DbfirestoreService
  ) {}
  @Input() productObj: object;
  @Input() name: string;
  @Input() imgUrl: string;
  @Input() title: string;
  @Input() favourite: string;
  @Input() subTitle: string;
  @Input() price: string | number;
  @Input() capacity: number | string | null;
  @Input() chair: boolean;
  @Input() bed: boolean;

  @Input() table: boolean;

  @Input() cupboard: boolean;

  @Input() Location: string;
  @Input() date: string;
  @Input() status: string;
  @Input() like: boolean;

  @Input() isPending: boolean = false;
  ngOnInit(): void {}

  updatelike(product) {
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
}
