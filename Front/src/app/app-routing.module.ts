import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CommandeComponent } from './commande/commande.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { SpinWheelComponent } from './spin-wheel/spin-wheel.component';
import { PaymentComponent } from './payment/payment.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashbordLayoutComponent } from './shared/dashbord-layout/dashbord-layout.component';
import { CommandeBackComponent } from './commande-back/commande-back.component';

const routes: Routes = [ {
  path: '', component: LayoutComponent, children: [
    { path: 'cart', component: CartComponent },
    { path: 'product', component: ProductListComponent },
    { path: 'commande', component: CommandeComponent },
    { path: 'order-form/:cartId', component: OrderFormComponent },
    { path: 'wheel', component: SpinWheelComponent },
    { path: 'payment', component: PaymentComponent }
  ]
},  {
  path: 'dashboard', component: DashbordLayoutComponent, children: [
    { path: 'commande', component: CommandeBackComponent },
    { path: 'product', component: ProductListComponent }
  ]
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
