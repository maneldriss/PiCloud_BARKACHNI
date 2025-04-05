import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { CommandeComponent } from './commande/commande.component';


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    LayoutComponent,
    ProductListComponent,
    CommandeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule 
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
