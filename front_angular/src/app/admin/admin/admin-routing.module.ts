import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import{ DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminGuard } from '../admin.guard';
import { AdManagementComponent } from './ad-management/ad-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CommandeBackComponent } from './commande-back/commande-back.component';

const routes: Routes = [{
  path: '', 
  component: AdminComponent,
  canActivate: [AdminGuard], // Add this guard
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    // other admin routes
    { path: 'ads', component: AdManagementComponent },
    { path: 'donation', component: AdminDashboardComponent },
    { path: 'commande', component: CommandeBackComponent }
  ]
}];
   




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
