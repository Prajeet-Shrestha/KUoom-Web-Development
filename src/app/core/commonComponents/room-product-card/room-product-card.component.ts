import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import { FirestoreQueryService } from 'src/app/services/firestorequery/firestore-query.service';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { NotifierService } from '../notifier/notifier.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewUserProfileComponent } from '../dialogBox/view-user-profile/view-user-profile.component';

@Component({
  selector: 'app-room-product-card',
  templateUrl: './room-product-card.component.html',
  styleUrls: ['./room-product-card.component.css'],
})
export class RoomProductCardComponent implements OnInit, AfterViewInit {
  constructor(
    private _fireQuery: FirestoreQueryService,
    private _router: Router,
    private _DataService: DataService,
    private _notify: NotifierService,
    public dialog: MatDialog,
    private _fireService: DbfirestoreService
  ) {}
  @Input() productObj: object;
  @Input() name: string;
  @Input() dateofbooking: string;
  @Input() imgUrl: string;
  @Input() imgObj: Array<object> = [];
  @Input() title: string;
  @Input() favourite: string;
  @Input() subTitle: string;
  @Input() price: string | number;
  @Input() capacity: number | string | null;
  @Input() chair: boolean;
  @Input() bed: boolean;
  @Input() applicantId: string;
  @Input() table: boolean;
  @Input() applicantName: string;
  @Input() cupboard: boolean;
  @Input() CanDeleteorEdit: boolean = false;
  @Input() Location: string;
  @Input() date: string;
  @Input() status: string;
  @Input() isChecked: boolean;
  @Input() like: boolean;
  @Input() TENANTBOOKLIST: boolean = false;
  @Input() isPending_LANDLORD: boolean = false;
  ngOnInit(): void {}
  sliderSizeOption = { width: '100%', height: '150px' };
  ngAfterViewInit() {
    // var eme = <HTMLElement>document.getElementById('imgContainer');
    // this.sliderSizeOption.height = eme.offsetHeight.toString();
    // console.log(eme.offsetHeight);
  }
  updatelike(product) {
    console.log(this.imgObj);
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

  editRoom(id) {
    if (this.CanDeleteorEdit) {
      this._DataService.changeisEditRoomValue(true);
      this._router.navigate([Url_SuperPath['editRoom'], id]);
    }
  }

  DeleteRoom(id) {
    var txt;
    if (confirm('Are You sure You wanna delete this Room?')) {
      this._fireService.deleteRoom(id, this.imgObj);
    } else {
      return;
    }
  }

  viewUserDetails() {
    this._DataService.changeApplicantId(this.applicantId);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.width = 'fit-content';
    dialogconfig.autoFocus = true;
    dialogconfig.panelClass = 'custom-dialog-container';
    this.dialog.open(ViewUserProfileComponent, dialogconfig);
  }
}
