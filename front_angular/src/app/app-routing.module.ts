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
  { path: 'admin', loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }