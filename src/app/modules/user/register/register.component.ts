import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { DbfirestoreService } from "src/app/services/dbfirestore/dbfirestore.service";
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserDetails } from 'src/app/interfaces/user-details';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  RegisterFromTenant: FormGroup;
  constructor(private fb: FormBuilder,private auth:AuthService, private dbFire:DbfirestoreService,
              private router:Router,private DataService:DataService) { }

  ngOnInit(): void {
    this.initializeForm();
  }


  RegisterTenant(){
    console.log(this.RegisterFromTenant.value);
    const {email,password} = this.RegisterFromTenant.value;
    const userData = {
      name: this.RegisterFromTenant.controls['firstName'].value +' '+ this.RegisterFromTenant.controls['lastName'].value,
      userType: 'Tenant'
    }
    
  
    console.log(userData);
    this.auth.RegisterasTenant(email,password).then(
      (res)=>{
        console.log(res);
        let userDetails:UserDetails = {
          name: this.RegisterFromTenant.controls['firstName'].value +' '+ this.RegisterFromTenant.controls['lastName'].value,
          imgUrl: "",
          email: email,
          userType: 'Tenant',
          phone:'',
          gender:"n/a",
          uid:res.user.uid.toString()
        }
        this.DataService.changeIsLoggedin(true);
        let user={
          name: userDetails.name,
          userType: userDetails.userType,
          email: email,
          phone:''
        }
        let Fullname = user.name.split(' ');
        this.DataService.changeMessage(userDetails.name);
        this.DataService.changeUserFullDetails({
          Fname: Fullname[0],
          Lname: Fullname[1],
          email: email,
          phone: user.phone
        });
        this.DataService.changeUserType(userDetails.userType);
        localStorage.removeItem('user');
        localStorage.setItem('user',JSON.stringify(user));
        this.dbFire.registerNewUser(userDetails,res.user.uid.toString()).then((res)=>{
                                                                                    this.router.navigate([Url_SuperPath['SearchRoom']]);
                                                                                  }).catch((err)=>{
                                                                                    console.log(err);
                                                                                  });
      }).catch((err)=>{
        console.log(err)
      })
  }
  initializeForm(): void {
    this.RegisterFromTenant = this.fb.group({
      email: ['', Validators.required],
      firstName: [''],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
}
