import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdManagementComponent } from './ad-management/ad-management.component';

const routes: Routes = [
  { 
    path: '', component: DashboardComponent,
    children: [
      { path: 'ads', component: AdManagementComponent },
      // Add other admin routes later
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
