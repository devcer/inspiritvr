import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { TicketsComponent } from './pages/tickets/tickets.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/requests',
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
