import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { BrandFormComponent } from './components/brands/brand-form/brand-form.component';
import { BrandDetailComponent } from './components/brands/brand-detail/brand-detail.component';
import { AdListComponent } from './components/ads/ad-list/ad-list.component';
import { AdFormComponent } from './components/ads/ad-form/ad-form.component';
import { AdDetailComponent } from './components/ads/ad-detail/ad-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ProfilComponent } from './components/auth/profil/profil.component';
import { ActivateAccountComponent } from './components/auth/activate-account/activate-account.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AppOauthRedirectComponent } from './components/auth/app-oauth-redirect/app-oauth-redirect.component';
import { OauthRedirectComponent } from './components/auth/oauth-redirect/oauth-redirect.component';
import { DonationListComponent } from './components/donations/donation-list/donation-list.component';
import { DonationFormComponent } from './components/donations/donation-form/donation-form.component';
import { DonationDetailComponent } from './components/donations/donation-detail/donation-detail.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { DashboardComponent } from './admin/admin/dashboard/dashboard.component';
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
import { CartComponent } from './components/cart/cart.component';
import { CommandeComponent } from './components/commande/commande.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SpinWheelComponent } from './components/spin-wheel/spin-wheel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'brands', component: BrandListComponent },
  { path: 'brands/add', component: BrandFormComponent },
  { path: 'brands/edit/:id', component: BrandFormComponent },
  { path: 'brands/:id', component: BrandDetailComponent },
  { path: 'ads', component: AdListComponent },
  { path: 'ads/add', component: AdFormComponent },
  { path: 'ads/edit/:id', component: AdFormComponent },
  { path: 'ads/:id', component: AdDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfilComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'oauth2/redirect', component: AppOauthRedirectComponent },
  {  path: 'auth/oauth-redirect', component: OauthRedirectComponent },
  { path: 'products', component: ProductListComponent},
  { path: 'products/men', component: MenShopComponent },
  { path: 'products/women', component: WomenShopComponent },
  { path: 'products/kids', component: KidsShopsComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductEditComponent },
  { path: 'products/view/:id', component: ProductDetailComponent },
  { path: 'products/reserved', component: ReservedProductsComponent },
  { path: 'products/myProducts', component: MyProductsComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminModule) },
 
      { path: 'donations', component: DonationListComponent },
      { path: 'donations/add', component: DonationFormComponent },
      { path: 'donations/edit/:id', component: DonationFormComponent },
      { path: 'donations/:id', component: DonationDetailComponent },
      { path: 'lead', component: LeaderboardComponent },
      {path: 'chat' ,component:ChatbotComponent},
      { path: 'post', component: PostListComponent },
  { path: 'add-post', component: PostFormComponent },
  { path: 'post/:id/commentaires', component: CommentaireListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'commande', component: CommandeComponent },
    { path: 'order-form/:cartId', component: OrderFormComponent },
    { path: 'wheel', component: SpinWheelComponent },
    { path: 'payment', component: PaymentComponent },
    {
      path: 'dressing',
      loadChildren: () => import('./components/Dressing/dressing/dressing.module').then(m => m.DressingModule)
    },
  
    {
      path: 'items',
      loadChildren: () => import('./components/Dressing/items/items.module').then(m => m.ItemsModule)
    },
  
    {
      path: 'outfits',
      loadChildren: () => import('./components/Dressing/outfits/outfits.module').then(m => m.OutfitsModule)
    },
  
    { path: '**', redirectTo: '' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }