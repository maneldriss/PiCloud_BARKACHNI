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
import { HomepageAdComponent } from './components/homepage-ad/homepage-ad.component';

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
    HomepageAdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
