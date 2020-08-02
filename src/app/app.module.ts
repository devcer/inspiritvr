import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReportsComponent } from './pages/reports/reports.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { TakeRequestDialogComponent } from './components/take-request-dialog/take-request-dialog.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular-highcharts';
import { AngularRaveModule } from 'angular-rave';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from './services/data/data.service';
import { TakeTicketDialogComponent } from './components/take-ticket-dialog/take-ticket-dialog.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportsComponent,
    RequestsComponent,
    TakeRequestDialogComponent,
    TakeTicketDialogComponent,
    TicketsComponent,
    TicketDetailsComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ChartModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSortModule,
    MatButtonToggleModule,
    AngularRaveModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
