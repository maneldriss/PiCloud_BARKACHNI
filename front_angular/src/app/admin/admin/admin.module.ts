import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AdManagementComponent } from './ad-management/ad-management.component';
import { FormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatTableModule } from '@angular/material/table';
import  { MatPaginatorModule } from '@angular/material/paginator';
import { CommandeBackComponent } from './commande-back/commande-back.component';



@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    SidebarComponent,
    EmployeeListComponent,
    AdManagementComponent,
    AdminDashboardComponent,
    CommandeBackComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class AdminModule { }
