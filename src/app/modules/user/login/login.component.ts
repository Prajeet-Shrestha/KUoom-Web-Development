import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { DataService } from "src/app/services/data.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserDetails } from "src/app/interfaces/user-details";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginFromTenant: FormGroup;
  username;
  LocalStorageUserDetail;
  errflag = false;
  autherrormessage:string ="";
  constructor(private DataService:DataService ,private fb: FormBuilder,private authService:AuthService, private dbFire:DbfirestoreService,
    private router:Router) {
    

     }

  ngOnInit(): void {
    this.initializeForm();
    this.DataService.currentUsername.subscribe((data)=>{
      this.username = data
    })
  }
  
  userDetails:UserDetails;
  LoginTenant(){
    const {email, password} = this.LoginFromTenant.value;
    const user={
      email: email,
      password: password
    };
    this.authService.loginAsTenant(user).then(
      (res)=>{
        console.log(res.user.uid);
        this.DataService.changeIsLoggedin(true);
        this.dbFire.getCurrentUserDetails(res.user.uid).subscribe((data)=>{
          console.log(data.data());
          this.userDetails = {
            name:data.data().name,
            imgUrl: data.data().img,
            email: data.data().email,
            uid: res.user.uid,
            userType: data.data().userType,
            phone:data.data().phone,
            gender:data.data().gender
          }
          this.authService.setUserDetails(this.userDetails);
          this.DataService.changeMessage(this.userDetails.name);
          this.DataService.changeUserType(this.userDetails.userType);
          let user={
            name: data.data().name,
            userType: data.data().userType
          }
          localStorage.removeItem('user');
          localStorage.setItem('user',JSON.stringify(user));
          if(this.userDetails.userType=="Tenant"){
            this.router.navigate([Url_SuperPath['SearchRoom']]);
          }
        },(err)=>{
          console.log(err);
        
        })
       
      }
    ).catch((err)=>{
      console.log(err);
      this.autherrormessage = err.message;
      console.log(this.autherrormessage);
      this.errflag = true;
    });
  }

  initializeForm(): void {
    this.LoginFromTenant = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  
}
