import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoverpageComponent } from './modules/coverpage/coverpage.component';
import { IndexComponent } from './modules/coverpage/index/index.component';
import { UserComponent } from './modules/user/user.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { ForgotPasswordComponent } from './modules/user/forgot-password/forgot-password.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';
import { ProductprofileComponent } from './modules/searchview/findroom/productprofile/productprofile.component';
import { SearchroomComponent } from './modules/searchview/findroom/searchroom/searchroom.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';
import { UserprofilesComponent } from './modules/userprofiles/userprofiles.component';
import { LandlordComponent } from './modules/userprofiles/landlord/landlord.component';
import { TenantComponent } from './modules/userprofiles/tenant/tenant.component';

import { NgImageSliderModule } from 'ng-image-slider';

import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ErrorPageComponent } from './core/errorPages/error-page/error-page.component';
import { FooterComponent } from './core/commonComponents/footer/footer/footer.component';
import { RoomProductCardComponent } from './core/commonComponents/room-product-card/room-product-card.component';
import { AddRoomComponent } from './core/commonComponents/add-room/add-room.component';
import { AboutusComponent } from './core/UIcomponents/aboutus/aboutus.component';
import { LoadingComponent } from './core/commonComponents/loading/loading.component';
import { NotifierComponent } from './core/commonComponents/notifier/notifier/notifier.component';
import { UserprofileComponent } from './core/commonComponents/userprofile/userprofile.component';
import { HowdoesthisworkComponent } from './core/UIcomponents/howdoesthiswork/howdoesthiswork.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
declare const Buffer;
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
    TenantComponent,
    ErrorPageComponent,
    FooterComponent,
    RoomProductCardComponent,
    AddRoomComponent,
    AboutusComponent,
    LoadingComponent,
    NotifierComponent,
    UserprofileComponent,
    HowdoesthisworkComponent,
  ],
  imports: [
    MatTabsModule,
    BrowserModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSliderModule,
    MatStepperModule,
    MatIconModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSnackBarModule,
    FormsModule,

    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatRippleModule,
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
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    RoomProductCardComponent,
    UserprofileComponent,
    ErrorPageComponent,
    MatDatepickerModule,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  declare Buffer;
}
