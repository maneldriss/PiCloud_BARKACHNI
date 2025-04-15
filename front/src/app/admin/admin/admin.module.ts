import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdManagementComponent } from './ad-management/ad-management.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdManagementComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    CommonModule,
  ]
})
export class AdminModule { }
