import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CommandeComponent } from './commande/commande.component';
import { OrderFormComponent } from './order-form/order-form.component';

const routes: Routes = [ { path: 'cart', component: CartComponent },
  { path: 'product', component: ProductListComponent }, { path: 'commande', component: CommandeComponent },
  { path: 'order-form/:cartId', component: OrderFormComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
