import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TaskComponent } from './task/task.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [AuthGuard], },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], },
  { path: 'sign-up', component: SignupComponent },
  { path: 'log-in', component: LoginComponent },
  { path: 'task', component: TaskComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
