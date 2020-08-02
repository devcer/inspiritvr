import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'requests',
    component: RequestsComponent
  },
  {
    path: 'tickets',
    component: TicketsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
