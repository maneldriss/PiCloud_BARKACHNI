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
import { CommonModule } from '@angular/common';
import { DonationDetailComponent } from './components/donations/donation-detail/donation-detail.component';
import { DonationFormComponent } from './components/donations/donation-form/donation-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { DonationListComponent } from './components/donations/donation-list/donation-list.component';

import { SharedModule } from './shared/shared.module';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { MenShopComponent } from './components/products/men-shop/men-shop.component';
import { WomenShopComponent } from './components/products/women-shop/women-shop.component';
import { KidsShopsComponent } from './components/products/kids-shops/kids-shops.component';
import { ReservedProductsComponent } from './components/products/reserved-products/reserved-products.component';
import { MyProductsComponent } from './components/products/my-products/my-products.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { CommentaireListComponent } from './components/commentaire-list/commentaire-list.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { CartComponent } from './components/cart/cart.component';
import { CommandeComponent } from './components/commande/commande.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { SpinWheelComponent } from './components/spin-wheel/spin-wheel.component';
import { RewardmodalComponent } from './components/rewardmodal/rewardmodal.component';
import { PaymentComponent } from './components/payment/payment.component';





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
    DonationDetailComponent,
    DonationFormComponent,
    DonationListComponent,
    ChatbotComponent,
    MyProductsComponent,
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent,
    ProductEditComponent,
    MenShopComponent,
    WomenShopComponent,
    KidsShopsComponent,
    ReservedProductsComponent,
    PostListComponent,
    PostFormComponent,
    CommentaireListComponent,
    LeaderboardComponent,
    CartComponent,
    CommandeComponent,
    OrderFormComponent,
    SpinWheelComponent,
    RewardmodalComponent,
    PaymentComponent
    
  
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CodeInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    ChatbotComponent, // Export ChatbotComponent so it can be used in other modules
  ],
})
export class AppModule { }
