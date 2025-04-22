import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AdManagementComponent } from './ad-management/ad-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    SidebarComponent,
    EmployeeListComponent,
    AdManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class AdminModule { }
