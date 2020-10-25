import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoverpageComponent } from './modules/coverpage/coverpage.component';
import { IndexComponent } from './modules/coverpage/index/index.component';
import { UserComponent } from './modules/user/user.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { ForgotPasswordComponent } from './modules/user/forgot-password/forgot-password.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs";
import {MatChipsModule} from '@angular/material/chips';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';
import { ProductprofileComponent } from './modules/searchview/findroom/productprofile/productprofile.component';
import { SearchroomComponent } from './modules/searchview/findroom/searchroom/searchroom.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {environment} from "src/environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    CoverpageComponent,
    IndexComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    SearchviewComponent,
    FindroomComponent,
    ProductprofileComponent,
    SearchroomComponent
  ],
  imports: [
    MatTabsModule,
    BrowserModule,
    MatSliderModule,
    MatSelectModule,
    MatNativeDateModule,FormsModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    AppRoutingModule,
    MatChipsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    MatMenuModule
 
  ],
  providers: [MatDatepickerModule,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
