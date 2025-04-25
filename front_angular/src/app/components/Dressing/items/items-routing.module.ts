import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItemListComponent} from "./item-list/item-list.component";
import {ItemFormComponent} from "./item-form/item-form.component";
import {ItemDetailComponent} from "./item-detail/item-detail.component";

const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'new', component: ItemFormComponent },
  { path: 'edit/:id', component: ItemFormComponent },
  { path: ':id', component: ItemDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
