import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/reports',
    pathMatch: 'full'
  },
  {
    path: 'reports',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
