import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/user/login/login.component';
import { IndexComponent } from './modules/coverpage/index/index.component';
import { CoverpageComponent } from './modules/coverpage/coverpage.component';
import { UserComponent } from './modules/user/user.component';
import { RegisterComponent } from './modules/user/register/register.component';
import { SearchviewComponent } from './modules/searchview/searchview.component';
import { FindroomComponent } from './modules/searchview/findroom/findroom.component';

const routes: Routes = [



  { path:"",redirectTo:'/cover/index',pathMatch:"full"},
  {path:"cover",component:CoverpageComponent,children:[
    { path: '', redirectTo: '/cover/index', pathMatch: 'full' },
    {path:'index',component:IndexComponent}
  ]},
  
  {path:"auth",component:UserComponent,children:[
    { path: '', redirectTo: '/auth/register', pathMatch: 'full' },
    {path:'register',component:RegisterComponent}
  ]},

  {path:"search",component:SearchviewComponent,children:[
    {path:'',redirectTo:"/search/findroom", pathMatch:'full'},
    {path:'findroom',component:FindroomComponent}
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
