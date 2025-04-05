import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CommandeComponent } from './commande/commande.component';

const routes: Routes = [ { path: 'cart', component: CartComponent },
  { path: 'product', component: ProductListComponent }, { path: 'commande', component: CommandeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
