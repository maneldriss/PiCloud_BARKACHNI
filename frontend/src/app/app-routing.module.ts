import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DonationListComponent } from './components/donations/donation-list/donation-list.component';
import { DonationFormComponent } from './components/donations/donation-form/donation-form.component';
import { DonationDetailComponent } from './components/donations/donation-detail/donation-detail.component';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'donations', component: DonationListComponent },
      { path: 'donations/add', component: DonationFormComponent },
      { path: 'donations/edit/:id', component: DonationFormComponent },
      { path: 'donations/:id', component: DonationDetailComponent },
      
    ]
  },
  
  
  
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }