import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from '../notifier/notifier.service';
import { roomDetailsTemplate } from '../../../interfaces/roomDetails';
import { DataService } from '../../../services/data.service';
import { DbfirestoreService } from '../../../services/dbfirestore/dbfirestore.service';
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'],
})
export class AddRoomComponent implements OnInit, AfterViewInit {
  isLinear = false;

  roomDetailsFG: FormGroup;
  facilitiesFG: FormGroup;
  addressFG: FormGroup;
  policiesFG: FormGroup;
  rentFG: FormGroup;
  landLordFG: FormGroup;
  roomPhoto: FormGroup;

  roomDetails: roomDetailsTemplate;
  LocalStorageUserDetail;
  constructor(
    private _dataService: DataService,
    private _notify: NotifierService,
    private _formBuilder: FormBuilder,
    private _db: DbfirestoreService
  ) {
    this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
  }
  AccomodationPolicies = [
    {
      name: 'policy #1',
    },
  ];
  ngAfterViewInit() {
    this.LocalStorageUserDetail = JSON.parse(localStorage.getItem('user'));
  }
  createItem(): FormGroup {
    return this._formBuilder.group({
      policies: '',
    });
  }
  policies: FormArray;
  addItem(): void {
    this.policies = this.policiesFG.get('policies') as FormArray;
    this.policies.push(this.createItem());
    this.addAccomodationPolicies();
  }
  ngOnInit() {
    this._dataService.changeTitle('Create a new room | KUoom');
    this.roomDetailsFG = this._formBuilder.group({
      roomType: ['', Validators.required],
      description: ['', Validators.required],
      isFurnished: ['', Validators.required],
      date: [Date, Validators.required],
      capacity: [0, Validators.required],
      hasBed: [false],
      hasChair: [false],
      hasCupBoard: [false],
      hasDesk: [false],
    });
    this.facilitiesFG = this._formBuilder.group({
      wifi: [false, Validators.required],
      laundary: [false, Validators.required],
      terrance: [false, Validators.required],
      AC: [false, Validators.required],
    });
    this.addressFG = this._formBuilder.group({
      address: ['', Validators.required],
    });
    this.policiesFG = this._formBuilder.group({
      policies: this._formBuilder.array([this.createItem()]),
    });
    this.rentFG = this._formBuilder.group({
      price: [0, Validators.required],
      wifi: [false],
      meals: [false],
      laundary: [false],
      roomSpace: [false],
      electricBill: [false],
    });
    this.roomPhoto = this._formBuilder.group({
      mainPhoto: ['', Validators.required],
      others: [''],
    });
    this.landLordFG = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      isTrusted: ['', Validators.required],
      img: [''],
    });
  }

  addAccomodationPolicies() {
    this.AccomodationPolicies.push({
      name: '',
    });
  }

  removeAccomodationPolicies() {
    this.policies.removeAt(-1);
    this.AccomodationPolicies.pop();
  }
  mainPhotoPath: string = '';
  loadMainImg(event) {
    let imgUpload = <HTMLInputElement>document.getElementById('upload_imgs'),
      imgPreview = <HTMLInputElement>document.getElementById('img_preview'),
      imgUploadForm = <HTMLInputElement>document.getElementById('img-upload-form'),
      totalFiles,
      previewTitle,
      previewTitleText,
      img;
    imgUpload.addEventListener(
      'change',
      (event?: HTMLInputEvent) => {
        totalFiles = imgUpload.files.length;

        if (!!totalFiles) {
          imgPreview.classList.remove('quote-imgs-thumbs--hidden');
          // previewTitle = document.createElement('p');
          // previewTitle.style.fontWeight = 'bold';
          // previewTitleText = document.createTextNode(totalFiles + ' Total Images Selected');
          // previewTitle.appendChild(previewTitleText);
          // imgPreview.appendChild(previewTitle);
        }

        for (var i = 0; i < totalFiles; i++) {
          img = document.createElement('img');
          img.src = URL.createObjectURL(event.target.files[i]);
          img.classList.add('img-preview-thumb');
          img.style.height = '100px';
          img.style.width = '150px';
          imgPreview.appendChild(img);
        }
      },
      false
    );
    imgUploadForm.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        alert('Images Uploaded! (not really, but it would if this was on your website)');
      },
      false
    );

    this.mainPhotoPath = event.target.files[0];
    var output = document.getElementById('MainImgoutput');
    output.setAttribute('src', URL.createObjectURL(event.target.files[0]));
    // output.onload = function () {
    //   URL.revokeObjectURL(output.src); // free memory
    // };
  }

  changePickerTest(event) {
    console.log(event);
    console.log(this.roomDetailsFG.value.date);
    // const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // console.log(
    //   ' Available from ' +
    //     this.roomDetailsFG.value.date.getDate().toString() +
    //     ' ' +
    //     monthNames[this.roomDetailsFG.value.date.getMonth()].toString() +
    //     ', ' +
    //     this.roomDetailsFG.value.date.getFullYear().toString()
    // );
    // console.log(this.facilitiesFG.value);
    // console.log(this.policiesFG.value);
    // console.log(this.rentFG.value);
    // console.log(this.roomPhoto.value);
    // console.log(this.landLordFG.value);
  }

  PackageForm() {
    let StringDate =
      this.roomDetailsFG.value.date.getFullYear().toString() +
      '-' +
      (this.roomDetailsFG.value.date.getMonth() + 1).toString() +
      '-' +
      this.roomDetailsFG.value.date.getDate().toString();
    // YYYY-MM-DD
    this.roomDetails = {
      id: '',
      policies: this.policiesFG.value.policies,
      availableDate: {
        dateObject: this.roomDetailsFG.value.date,
        YYYYMMDD: StringDate,
      },
      basicQA: null,
      isAvailable: true,
      isBooked: false,
      description: this.roomDetailsFG.value.description,
      location: this.addressFG.value.address,
      roomType: this.roomDetailsFG.value.roomType,
      capacity: this.roomDetailsFG.value.capacity,
      landLordDetails: {
        fullName: this.landLordFG.value.name,
        email: this.landLordFG.value.email,
        phone: this.landLordFG.value.phone,
        isTrusted: this.landLordFG.value.isTrusted == 'yes' ? true : false,
        img: this.landLordFG.value.img,
      },
      facilities: this.facilitiesFG.value,
      feeDetails: this.rentFG.value,
      images: {
        mainPhoto: this.roomPhoto.value.mainPhoto,
        extras: null,
      },
      furnishedDetails: {
        isFurnished: this.roomDetailsFG.value.isFurnished == 'Furnished' ? true : false,
        objects: {
          hasChair: this.roomDetailsFG.value.hasChair,
          hasBed: this.roomDetailsFG.value.hasBed,
          hasDesk: this.roomDetailsFG.value.hasDesk,
          hasCupBoard: this.roomDetailsFG.value.hasCupBoard,
        },
      },
    };
    console.log(this.landLordFG.valid);
  }
  @ViewChild('stepper') stepper;
  SubmitRoomDetails() {
    this.PackageForm();
    if (
      this.roomDetailsFG.valid &&
      this.facilitiesFG.valid &&
      this.addressFG.valid &&
      this.policiesFG.valid &&
      this.rentFG.valid &&
      this.roomPhoto.valid &&
      this.landLordFG.valid
    ) {
      this._db.addNewRoom(this.roomDetails, this.mainPhotoPath);
      this.roomDetailsFG.reset();
      this.facilitiesFG.reset();
      this.addressFG.reset();
      this.policiesFG.reset();
      this.rentFG.reset();
      this.roomPhoto.reset();
      this.landLordFG.reset();
      var output = document.getElementById('MainImgoutput');
      output.removeAttribute('src');
      // this._notify.showNotification('', 'Room Added!', 'success', 'right');
    } else {
      // window.alert('missing Field');
      this.stepper.reset();
      this._notify.showNotification('Sorry, Please Fill the form before submitting.', 'Error!', 'error', 'right');
    }
  }
}
