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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs";
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';
import { ProductprofileComponent } from './modules/searchview/findroom/productprofile/productprofile.component';
import { SearchroomComponent } from './modules/searchview/findroom/searchroom/searchroom.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from "@angular/material/icon";

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {environment} from "src/environments/environment";
import { UserprofilesComponent } from './modules/userprofiles/userprofiles.component';
import { LandlordComponent } from './modules/userprofiles/landlord/landlord.component';
import { TenantComponent } from './modules/userprofiles/tenant/tenant.component';


import { NgImageSliderModule } from 'ng-image-slider';

import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core"
import { TranslateHttpLoader } from  "@ngx-translate/http-loader"
import { HttpClient } from '@angular/common/http';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    SearchroomComponent,
    UserprofilesComponent,
    LandlordComponent,
    TenantComponent
  ],
  imports: [
    MatTabsModule,
    BrowserModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatSelectModule,
    MatNativeDateModule,FormsModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgImageSliderModule,
    AppRoutingModule,
    MatMenuModule,
    MatChipsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
 
  ],
  providers: [MatDatepickerModule,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
