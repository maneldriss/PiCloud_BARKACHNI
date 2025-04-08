import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DonationListComponent } from './components/donations/donation-list/donation-list.component';
import { DonationFormComponent } from './components/donations/donation-form/donation-form.component';
import { DonationDetailComponent } from './components/donations/donation-detail/donation-detail.component';
import { SharedModule } from './shared/shared.module';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DonationListComponent,
    DonationFormComponent,
    DonationDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  

}