import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from './shared';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommodityComponent } from './commodity/commodity.component';
import { CommodityDetailsComponent } from './commodity-details/commodity-details.component';
import { SearchFilterPipe } from './_services/searchfilter.pipe';
import { BackendService, DataItemService } from './_services';
import { AnimationsService } from './_animations';
import { KinveyModule } from 'kinvey-angular-sdk';
import { CommodityValidationComponent, ActionRenderer, DeleteRenderer } from './commodity-validation/commodity-validation.component';
import { ReportComponent } from './report/report.component';
import { WeeklyFormsComponent } from './weekly-forms/weekly-forms.component';
import { WeeklyTableComponent } from './weekly-table/weekly-table.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CommodityComponent,
    CommodityDetailsComponent,
    SearchFilterPipe,
    CommodityValidationComponent,
    ActionRenderer,
    DeleteRenderer,
    ReportComponent,
    WeeklyFormsComponent,
    WeeklyTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
     AgGridModule.withComponents([ActionRenderer, DeleteRenderer]),
     KinveyModule.init({
      appKey: 'kid_SyUyLQwwN',
      appSecret: '3cc1c58efbb0401c9bbfd612ffc55407'
    })
  ],
  providers: [BackendService, DataItemService, AnimationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
