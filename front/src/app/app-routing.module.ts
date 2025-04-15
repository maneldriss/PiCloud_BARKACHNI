import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { BrandFormComponent } from './components/brands/brand-form/brand-form.component';
import { BrandDetailComponent } from './components/brands/brand-detail/brand-detail.component';
import { AdListComponent } from './components/ads/ad-list/ad-list.component';
import { AdFormComponent } from './components/ads/ad-form/ad-form.component';
import { AdDetailComponent } from './components/ads/ad-detail/ad-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'brands', component: BrandListComponent },
  { path: 'brands/add', component: BrandFormComponent },
  { path: 'brands/edit/:id', component: BrandFormComponent },
  { path: 'brands/:id', component: BrandDetailComponent },
  { path: 'ads', component: AdListComponent },
  { path: 'ads/add', component: AdFormComponent },
  { path: 'ads/edit/:id', component: AdFormComponent },
  { path: 'ads/:id', component: AdDetailComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }