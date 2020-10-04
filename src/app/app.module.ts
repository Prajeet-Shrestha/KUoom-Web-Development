import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';
import { ProductprofileComponent } from './modules/searchview/findroom/productprofile/productprofile.component';
import { SearchroomComponent } from './modules/searchview/findroom/searchroom/searchroom.component';
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
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
 
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
