import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { BrandFormComponent } from './components/brands/brand-form/brand-form.component';
import { BrandDetailComponent } from './components/brands/brand-detail/brand-detail.component';
import { AdListComponent } from './components/ads/ad-list/ad-list.component';
import { AdFormComponent } from './components/ads/ad-form/ad-form.component';
import { AdDetailComponent } from './components/ads/ad-detail/ad-detail.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { TruncatePipe } from './truncate.pipe';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ProfilComponent } from './components/auth/profil/profil.component';
import { ActivateAccountComponent } from './components/auth/activate-account/activate-account.component';
import { CodeInputModule } from 'angular-code-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/auth/register/register.component';
import { AppOauthRedirectComponent } from './components/auth/app-oauth-redirect/app-oauth-redirect.component';
import { OauthRedirectComponent } from './components/auth/auth/oauth-redirect/oauth-redirect.component';
import { UserManagementComponent } from './admin/admin/user-management/user-management.component';
import { SidebarComponent } from './admin/admin/sidebar/sidebar.component';
import { ReservedProductsComponent } from './components/products/reserved-products/reserved-products.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { MenShopComponent } from './components/products/men-shop/men-shop.component';
import { WomenShopComponent } from './components/products/women-shop/women-shop.component';
import { KidsShopsComponent } from './components/products/kids-shops/kids-shops.component';


@NgModule({
  declarations: [
    AppComponent,
    BrandListComponent,
    BrandFormComponent,
    BrandDetailComponent,
    AdListComponent,
    AdFormComponent,
    AdDetailComponent,
    HomeComponent,
    LayoutComponent,
    TruncatePipe,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfilComponent,
    ActivateAccountComponent,
    RegisterComponent,
    AppOauthRedirectComponent,
    OauthRedirectComponent,
    UserManagementComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent,
    ProductEditComponent,
    MenShopComponent,
    WomenShopComponent,
    KidsShopsComponent,
    ReservedProductsComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CodeInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
