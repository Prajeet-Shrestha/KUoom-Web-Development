import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { DbfirestoreService } from "src/app/services/dbfirestore/dbfirestore.service";
import Url_SuperPath from "src/app/environment/Url_SuperPath.json";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  RegisterFromTenant: FormGroup;
  constructor(private fb: FormBuilder,private auth:AngularFireAuth, private dbFire:DbfirestoreService,
              private router:Router) { }

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
    this.auth.createUserWithEmailAndPassword(email,password).then(
      (res)=>{
        console.log(res);
        this.dbFire.registerNewUser(userData,res.user.uid.toString()).then((res)=>{
                                                                                    console.log(res);
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
