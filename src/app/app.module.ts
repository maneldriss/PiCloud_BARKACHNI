import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { MenShopComponent } from './components/men-shop/men-shop.component';
import { WomenShopComponent } from './components/women-shop/women-shop.component';
import { KidsShopsComponent } from './components/kids-shops/kids-shops.component';
import { ReservedProductsComponent } from './components/reserved-products/reserved-products.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { MyProductsComponent } from './components/my-products/my-products.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent,
    LayoutComponent,
    ProductEditComponent,
    MenShopComponent,
    WomenShopComponent,
    KidsShopsComponent,
    ReservedProductsComponent,
    DashboardComponent,
    MyProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
