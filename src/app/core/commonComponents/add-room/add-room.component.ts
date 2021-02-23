import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from '../notifier/notifier.service';
import { roomDetailsTemplate } from '../../../interfaces/roomDetails';
import { DataService } from '../../../services/data.service';
import { DbfirestoreService } from '../../../services/dbfirestore/dbfirestore.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Router } from '@angular/router';
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
  AddRoomLocationDropDownList: Array<object> = [];
  roomDetailsFG: FormGroup;
  facilitiesFG: FormGroup;
  addressFG: FormGroup;
  policiesFG: FormGroup;
  rentFG: FormGroup;
  landLordFG: FormGroup;
  NewLocationForm: FormGroup;
  roomPhoto: FormGroup;

  roomDetails: roomDetailsTemplate;
  LocalStorageUserDetail;
  constructor(
    private _dataService: DataService,
    private _notify: NotifierService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _db: DbfirestoreService,
    public sanitizeURL: DomSanitizer
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
  createItem(value: '' | string = ''): FormGroup {
    this.addAccomodationPolicies();
    return this._formBuilder.group({
      policies: value,
    });
  }
  showLocationForm: boolean = false;
  toggleLocationForm() {
    this.showLocationForm = this.showLocationForm ? false : true;
  }
  UsableEmbbedCode: SafeResourceUrl;
  ShownewMap = false;
  SaveLocation() {
    if (!this.mapError && this.ShownewMap && this.NewLocationForm.valid) {
      let locationObj = {
        name: this.NewLocationForm.value.LocationName,
        embbedCode:
          'https://www.google.com/maps/embed?pb=' + this.NewLocationForm.value.embbedCode.split('=')[2].split('"')[0],
        id: '',
      };
      this._db
        .addNewLocation(locationObj)
        .then((res) => {
          this._notify.showNotification('New Location Added', '', 'success');
          this.NewLocationForm.reset();
        })
        .catch((err) => {
          this._notify.showNotification('SOMETHING WENT WRONG!', '', 'error');
        });
      console.log(locationObj);
    }
  }
  mapError = false;
  sanitizeURLFunction(url): SafeResourceUrl {
    return this.sanitizeURL.bypassSecurityTrustResourceUrl(url);
  }
  ShowMap() {
    if (this.NewLocationForm.value.embbedCode.length >= 10) {
      try {
        this.UsableEmbbedCode = this.sanitizeURLFunction(
          'https://www.google.com/maps/embed?pb=' + this.NewLocationForm.value.embbedCode.split('=')[2].split('"')[0]
        );

        this.ShownewMap = this.ShownewMap ? false : true;
        this.mapError = false;
      } catch (e) {
        console.error(':::INVALID GOOGLE MAP CODE:::::');
        this.mapError = true;
      }
    }
  }

  policies: FormArray;
  addItem(string: string | '' = ''): void {
    this.policies = this.policiesFG.get('policies') as FormArray;
    this.policies.push(this.createItem(string));
  }

  isEditModeOBJ = { isEditMode: false, EditRoomId: '' };
  selectedRoomData: roomDetailsTemplate = {
    id: '',
    isChecked: false,
    policies: [
      {
        policies: '',
      },
    ],
    basicQA: [],
    capacity: 0,
    isAvailable: true,
    location: {
      name: '',
      url: '',
    },
    availableDate: null,
    roomType: '',
    // isBooked: false,
    description: '',
    landLordDetails: {
      fullName: '',
      email: '',
      phone: '',
      isTrusted: false,
      img: '',
    },

    facilities: {
      AC: false,
      laundary: false,
      terrance: false,
      wifi: false,
    },

    feeDetails: {
      price: '',
      electricBill: false,
      laundary: false,
      meals: false,
      roomSpace: false,
      wifi: false,
    },

    images: {
      mainPhoto: '',
      extras: [],
    },

    furnishedDetails: {
      isFurnished: false,
      objects: {
        hasChair: false,
        hasDesk: false,
        hasBed: false,
        hasCupBoard: false,
      },
    },
  };
  OldAvailableDate = '';
  ngOnInit() {
    let self = this;
    this._dataService.isEditRoom.subscribe((data) => {
      if (data) {
        this.isEditModeOBJ.isEditMode = true;
        console.log(this._router.url.split('/')[2]);
        this.isEditModeOBJ.EditRoomId = this._router.url.split('/')[2];
        console.log(this.isEditModeOBJ);
        this._dataService.changeTitle('Edit room | KUoom');
        if (this._router.url.split('/').includes('addRoom')) {
          this._router.navigate(['/profile/l']);
        }
        this._db.getSelectedRoom(this.isEditModeOBJ.EditRoomId.toString()).then((data) => {
          console.log(data);
          let remodeledData = data.data();
          if (remodeledData) {
            this.selectedRoomData = {
              id: remodeledData.id,
              availableDate: remodeledData.availableDate,
              isAvailable: remodeledData.isAvailable,
              capacity: remodeledData.capacity ? remodeledData.capacity : 'Unavailable',
              policies: remodeledData.policies,
              isChecked: remodeledData.isChecked ? remodeledData.isChecked : false,
              basicQA: remodeledData.basicQA,
              // isBooked: remodeledData.isBooked ? true : false,
              location: remodeledData.location,
              roomType: remodeledData.roomType,
              description: remodeledData.description ? remodeledData.description : '',
              landLordDetails: {
                fullName: remodeledData.landLordDetails.fullName,
                email: remodeledData.landLordDetails.email,
                phone: remodeledData.landLordDetails.phone,
                isTrusted: remodeledData.landLordDetails.isTrusted,
                img: remodeledData.landLordDetails.img,
              },

              facilities: remodeledData.facilities,

              feeDetails: remodeledData.feeDetails,

              images: {
                mainPhoto: remodeledData.images.mainPhoto,
                extras: remodeledData.images.extras,
              },

              furnishedDetails: {
                isFurnished: remodeledData.furnishedDetails.isFurnished,
                objects: remodeledData.furnishedDetails.objects,
              },
            };
            let PoliciesList = [];
            try {
              var output = <HTMLInputElement>document.getElementById('MainImgoutput');
              output.src = this.selectedRoomData.images.mainPhoto.toString();
              let imgUpload = <HTMLInputElement>document.getElementById('upload_imgs'),
                imgPreview = <HTMLInputElement>document.getElementById('img_preview'),
                imgUploadForm = <HTMLInputElement>document.getElementById('img-upload-form'),
                totalFiles,
                previewTitle,
                previewTitleText,
                img;

              totalFiles = this.selectedRoomData.images.extras.length;

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
                img.src = this.selectedRoomData.images.extras[i].toString();
                // this.ExtraImgSrc.push(this.selectedRoomData.images.extras[i]);
                img.classList.add('img-preview-thumb');
                img.style.height = '100px';
                img.style.width = '150px';
                imgPreview.appendChild(img);
              }
              console.log(this.ExtraImgSrc);
              console.log(this.mainPhotoPath);
            } catch (e) {
              console.log(e);
            }
            console.log(this.selectedRoomData);
            if (this.selectedRoomData.policies.length >= 1) {
              for (let pI = 0; pI < this.selectedRoomData.policies.length; pI++) {
                PoliciesList.push(this.createItem(this.selectedRoomData.policies[pI]['policies']));
              }
            }

            this.OldAvailableDate = new Date(
              this.selectedRoomData.availableDate.dateObject['seconds'] * 1000
            ).toDateString();
            this.roomDetailsFG = this._formBuilder.group({
              roomType: [this.selectedRoomData.roomType, Validators.required],
              description: [this.selectedRoomData.description, Validators.required],
              isFurnished: [
                this.selectedRoomData.furnishedDetails.isFurnished ? 'Furnished' : 'unFurnished',
                Validators.required,
              ],
              date: [new Date(this.selectedRoomData.availableDate.dateObject['seconds'] * 1000), Validators.required],
              capacity: [this.selectedRoomData.capacity ? this.selectedRoomData.capacity : 0, Validators.required],
              hasBed: [this.selectedRoomData.furnishedDetails.objects.hasBed],
              hasChair: [this.selectedRoomData.furnishedDetails.objects.hasChair],
              hasCupBoard: [this.selectedRoomData.furnishedDetails.objects.hasCupBoard],
              hasDesk: [this.selectedRoomData.furnishedDetails.objects.hasDesk],
            });
            this.facilitiesFG = this._formBuilder.group({
              wifi: [this.selectedRoomData.facilities.wifi, Validators.required],
              laundary: [this.selectedRoomData.facilities.laundary, Validators.required],
              terrance: [this.selectedRoomData.facilities.terrance, Validators.required],
              AC: [this.selectedRoomData.facilities.AC, Validators.required],
            });
            this.addressFG = this._formBuilder.group({
              address: [this.selectedRoomData.location.url, Validators.required],
            });

            this.policiesFG = this._formBuilder.group({
              policies: this._formBuilder.array(PoliciesList),
            });
            this.rentFG = this._formBuilder.group({
              price: [this.selectedRoomData.feeDetails.price, Validators.required],
              wifi: [this.selectedRoomData.feeDetails.wifi],
              meals: [this.selectedRoomData.feeDetails.meals],
              laundary: [this.selectedRoomData.feeDetails.laundary],
              roomSpace: [this.selectedRoomData.feeDetails.roomSpace],
              electricBill: [this.selectedRoomData.feeDetails.electricBill],
            });

            this.landLordFG = this._formBuilder.group({
              name: [this.selectedRoomData.landLordDetails.fullName, Validators.required],
              phone: [this.selectedRoomData.landLordDetails.phone, Validators.required],
              email: [this.selectedRoomData.landLordDetails.email],
              isTrusted: [this.selectedRoomData.landLordDetails.isTrusted ? 'yes' : 'no', Validators.required],
              img: [''],
            });
            console.log(this.selectedRoomData);
          }
        });
      } else {
        this._dataService.changeTitle('Create a new room | KUoom');
        if (this._router.url.split('/').includes('editRoom')) {
          this._router.navigate(['/profile/l']);
        }
      }
    });

    this._db.getLocationsList().then((res) => {
      // console.log(res);
      res.forEach(function (doc) {
        console.log(doc.data);
        self.AddRoomLocationDropDownList.push(doc.data());
      });
      console.log(self.AddRoomLocationDropDownList);
    });

    this.NewLocationForm = this._formBuilder.group({
      LocationName: ['', Validators.required],
      embbedCode: ['', Validators.required],
    });
    this.roomDetailsFG = this._formBuilder.group({
      roomType: ['', Validators.required],
      description: ['', Validators.required],
      isFurnished: ['', Validators.required],
      isChecked: [false, Validators.required],
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
      roomSpace: [true],
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
  ExtraImgSrc = [];
  loadMainImg(event) {
    this.ExtraImgSrc = [];
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
          this.ExtraImgSrc.push(event.target.files[i]);
          img.classList.add('img-preview-thumb');
          img.style.height = '100px';
          img.style.width = '150px';
          imgPreview.appendChild(img);
        }
        console.log(this.ExtraImgSrc);
        console.log(this.mainPhotoPath);
      },
      false
    );
    imgUploadForm.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        alert('Images Uploaded! ');
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
    console.log(this.addressFG.value.address);
    console.log(this.getLocationName(this.addressFG.value.address));
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

  getLocationName(url: string): string {
    let name = '';
    this.AddRoomLocationDropDownList.forEach((data) => {
      console.log(data['embbedCode']);
      if (data['embbedCode'] == url) {
        name = data['name'];
      }
    });
    return name;
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
      isChecked: this.roomDetailsFG.value.isChecked == 'checked' ? true : false,
      // isBooked: false,
      description: this.roomDetailsFG.value.description,
      location: {
        name: this.getLocationName(this.addressFG.value.address),
        url: this.addressFG.value.address,
      },
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
    console.log(this.roomDetails);
  }
  @ViewChild('stepper') stepper;
  SubmitRoomDetails() {
    this.PackageForm();
    if (!this.isEditModeOBJ.isEditMode) {
      if (
        this.roomDetailsFG.valid &&
        this.facilitiesFG.valid &&
        this.addressFG.valid &&
        this.policiesFG.valid &&
        this.rentFG.valid &&
        this.roomPhoto.valid &&
        this.landLordFG.valid
      ) {
        this._db.addNewRoom(this.roomDetails, this.mainPhotoPath, this.ExtraImgSrc);
        this.roomDetailsFG.reset();
        this.facilitiesFG.reset();
        this.addressFG.reset();
        this.policiesFG.reset();
        this.rentFG.reset();
        this.roomPhoto.reset();
        this.landLordFG.reset();
        var output = document.getElementById('MainImgoutput');
        output.removeAttribute('src');
        this._notify.showNotification('', 'Room Added!', 'success', 'right');
      } else {
        // window.alert('missing Field');
        this.stepper.reset();
        this._notify.showNotification('Sorry, Please Fill the form before submitting.', 'Error!', 'error', 'right');
      }
    } else {
      this.roomDetails.id = this.isEditModeOBJ.EditRoomId;
      if (this.mainPhotoPath.length <= 1) {
        this.roomDetails.images.mainPhoto = this.selectedRoomData.images.mainPhoto;
      }
      if (this.ExtraImgSrc.length == 0) {
        this.roomDetails.images.extras = this.selectedRoomData.images.extras;
      }
      console.log(this.roomDetails);
    }
  }
}
