import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/user/login/login.component';
import { IndexComponent } from './modules/coverpage/index/index.component';
import { CoverpageComponent } from './modules/coverpage/coverpage.component';
import { UserComponent } from './modules/user/user.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';
import { SearchroomComponent } from './modules/searchview/findroom/searchroom/searchroom.component';
import { ProductprofileComponent } from './modules/searchview/findroom/productprofile/productprofile.component';
import Url_SuperPath from 'src/app/environment/Url_SuperPath.json';

import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserprofilesComponent } from './modules/userprofiles/userprofiles.component';
import { TenantComponent } from './modules/userprofiles/tenant/tenant.component';
import { LandlordComponent } from './modules/userprofiles/landlord/landlord.component';
import { AddRoomComponent } from './core/commonComponents/add-room/add-room.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([Url_SuperPath['login']]);
const redirectLoggedInToItems = () => redirectLoggedInTo([Url_SuperPath['Index']]);

const routes: Routes = [
  { path: '', redirectTo: '/cover/index', pathMatch: 'full' },
  {
    path: 'cover',
    component: CoverpageComponent,
    children: [
      { path: '', redirectTo: '/cover/index', pathMatch: 'full' },
      { path: 'index', component: IndexComponent },
    ],
  },

  {
    path: 'auth',
    component: UserComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems },
    children: [
      { path: '', redirectTo: '/auth/register', pathMatch: 'full' },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ],
  },

  {
    path: 'search',
    component: SearchviewComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      { path: '', redirectTo: '/search/fr', pathMatch: 'full' },
      {
        path: 'fr',
        component: FindroomComponent,
        children: [
          { path: '', redirectTo: '/search/fr/sr', pathMatch: 'full' },
          { path: 'sr', component: SearchroomComponent },
          { path: 'profile', component: ProductprofileComponent },
        ],
      },
    ],
  },

  {
    path: 'profile',
    component: UserprofilesComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      { path: '', redirectTo: '/profile/t', pathMatch: 'full' },
      { path: 't', component: TenantComponent },
      { path: 'l', component: LandlordComponent },
    ],
  },
  { path: 'addRoom', component: AddRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
