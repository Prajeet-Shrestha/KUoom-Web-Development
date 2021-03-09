import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserDetails } from 'src/app/interfaces/user-details';
import { DataService } from 'src/app/services/data.service';
import { NotifierService } from 'src/app/core/commonComponents/notifier/notifier.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  RegisterFromTenant: FormGroup;
  RegisterFromLandlord: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private dbFire: DbfirestoreService,
    private router: Router,
    private _notify: NotifierService,
    private DataService: DataService
  ) {}
  rePassword = '';
  ngOnInit(): void {
    this.initializeForm();
    this.DataService.changeTitle('Register | KUoom');
  }
  // TODO: Need to make it for the Landlord as well
  RegisterTenant() {
    if (this.RegisterFromTenant.valid) {
      console.log(this.RegisterFromTenant.value);
      if (this.RegisterFromTenant.value.password == this.RegisterFromTenant.value.repassword) {
        const { email, password } = this.RegisterFromTenant.value;
        const userData = {
          name:
            this.RegisterFromTenant.controls['firstName'].value +
            ' ' +
            this.RegisterFromTenant.controls['lastName'].value,
          userType: 'Tenant',
        };
        console.log(userData);
        this.auth
          .RegisterasTenant(email, password)
          .then((res) => {
            console.log(res);
            let userDetails: UserDetails = {
              name:
                this.RegisterFromTenant.controls['firstName'].value +
                ' ' +
                this.RegisterFromTenant.controls['lastName'].value,
              imgUrl: '',
              email: email,
              userType: 'Tenant',
              phone: '',
              gender: 'n/a',
              uid: res.user.uid.toString(),
            };
            this.DataService.changeIsLoggedin(true);
            let user = {
              uid: res.user.uid.toString(),
              name: userDetails.name,
              userType: this.auth.enCode(userDetails.userType),
              email: email,
              phone: '',
            };
            let Fullname = user.name.split(' ');
            this.DataService.changeMessage(userDetails.name);
            this.DataService.changeUserFullDetails({
              Fname: Fullname[0],
              Lname: Fullname[1],
              email: email,
              phone: user.phone,
            });
            this.DataService.changeUserType(userDetails.userType);
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(user));
            this.dbFire
              .registerNewUser(userDetails, res.user.uid.toString())
              .then((res) => {
                this.router.navigate([Url_SuperPath['SearchRoom']]);
              })
              .catch((err) => {
                console.log(err);
                this._notify.showNotification(err.message, '', 'error');
              });
          })
          .catch((err) => {
            console.log(err);
            // console.log(err);
            this._notify.showNotification(err.message, '', 'error');
          });
      } else {
        this._notify.showNotification('Password Doesnt match', '', 'error');
      }
    } else {
      this._notify.showNotification('Fill the Valid Form', '', 'error');
    }
  }

  RegisterLandlord() {
    if (this.RegisterFromLandlord.valid) {
      if (this.RegisterFromLandlord.value.password == this.RegisterFromLandlord.value.repassword) {
        console.log(this.RegisterFromLandlord.value);
        const { email, password } = this.RegisterFromLandlord.value;
        const userData = {
          name:
            this.RegisterFromLandlord.controls['firstName'].value +
            ' ' +
            this.RegisterFromLandlord.controls['lastName'].value,
          userType: 'Landlord',
        };
        console.log(userData);
        this.auth
          .RegisterasTenant(email, password)
          .then((res) => {
            console.log(res);
            let userDetails: UserDetails = {
              name:
                this.RegisterFromLandlord.controls['firstName'].value +
                ' ' +
                this.RegisterFromLandlord.controls['lastName'].value,
              imgUrl: '',
              email: email,
              userType: 'Landlord',
              phone: this.RegisterFromLandlord.value.phone,
              gender: 'n/a',
              uid: res.user.uid.toString(),
            };
            this.DataService.changeIsLoggedin(true);
            let user = {
              uid: res.user.uid.toString(),
              name: userDetails.name,
              userType: this.auth.enCode(userDetails.userType),
              email: email,
              phone: userDetails.phone,
            };
            let Fullname = user.name.split(' ');
            this.DataService.changeMessage(userDetails.name);
            this.DataService.changeUserFullDetails({
              Fname: Fullname[0],
              Lname: Fullname[1],
              email: email,
              phone: user.phone,
            });
            this.DataService.changeUserType(userDetails.userType);
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(user));
            this.dbFire
              .registerNewUser(userDetails, res.user.uid.toString())
              .then((res) => {
                this.router.navigate([Url_SuperPath['SearchRoom']]);
              })
              .catch((err) => {
                this._notify.showNotification(err.message, '', 'error');

                console.log(err);
              });
          })
          .catch((err) => {
            this._notify.showNotification(err.message, '', 'error');

            console.log(err);
          });
      }
    } else {
      this._notify.showNotification('Fill the Valid Form', '', 'error');
    }
  }

  GoogleSignIn(type) {
    this.auth.signInwithGoogle(type);
  }

  initializeForm(): void {
    this.RegisterFromLandlord = this.fb.group({
      email: ['', Validators.email],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      repassword: ['', Validators.required],
    });
    this.RegisterFromTenant = this.fb.group({
      email: ['', Validators.email],
      firstName: [''],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    });
  }
}
