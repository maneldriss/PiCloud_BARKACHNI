import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path:'items',
    loadChildren: () => import('./features/items/items.module').then(m => m.ItemsModule)
  },
  {
    path: 'outfits',
    loadChildren: () => import('./features/outfits/outfits.module').then(m => m.OutfitsModule)
  },
  {
    path: 'dressing',
    loadChildren: () => import('./features/dressing/dressing.module').then(m => m.DressingModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
