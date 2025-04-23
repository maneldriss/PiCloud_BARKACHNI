import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { MenShopComponent } from './components/men-shop/men-shop.component';
import { WomenShopComponent } from './components/women-shop/women-shop.component';
import { KidsShopsComponent } from './components/kids-shops/kids-shops.component';
import { ReservedProductsComponent } from './components/reserved-products/reserved-products.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { MyProductsComponent } from './components/my-products/my-products.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent},
  { path: 'products/men', component: MenShopComponent },
  { path: 'products/women', component: WomenShopComponent },
  { path: 'products/kids', component: KidsShopsComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductEditComponent },
  { path: 'products/view/:id', component: ProductDetailComponent },
  { path: 'products/reserved', component: ReservedProductsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products/myProducts', component: MyProductsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
