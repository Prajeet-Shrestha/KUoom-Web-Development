import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbfirestoreService } from 'src/app/services/dbfirestore/dbfirestore.service';
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginFromTenant: FormGroup;
  username;
  LocalStorageUserDetail;
  constructor(private DataService:DataService ,private fb: FormBuilder,private auth:AngularFireAuth, private dbFire:DbfirestoreService,
    private router:Router) {
    

     }

  ngOnInit(): void {
    this.initializeForm();
    this.DataService.currentMessage.subscribe((data)=>{
      this.username = data
    })
  }
  
  userDetails;
  LoginTenant(){
    const {email, password} = this.LoginFromTenant.value;
    console.log(this.LoginFromTenant.value);
    this.auth.signInWithEmailAndPassword(email,password).then(
      (res)=>{
        console.log(res.user.uid);
        this.dbFire.getCurrentUserDetails(res.user.uid).subscribe((data)=>{
          console.log(data.data());
          this.userDetails = data.data();
          this.DataService.changeMessage(this.userDetails.name);
          localStorage.setItem('user',JSON.stringify(data.data()));
          if(this.userDetails.userType=="Tenant"){
            this.router.navigate([Url_SuperPath['SearchRoom']]);
          }
        },(err)=>{
          console.log(err);
        })
       
      }
    ).catch((err)=>{
      console.log(err);
    });
  }

  initializeForm(): void {
    this.LoginFromTenant = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  
}
