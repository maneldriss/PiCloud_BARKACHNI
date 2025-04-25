import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OutfitDetailComponent} from "./outfit-detail/outfit-detail.component";
import {OutfitFormComponent} from "./outfit-form/outfit-form.component";
import {OutfitListComponent} from "./outfit-list/outfit-list.component";

const routes: Routes = [
  { path: '', component: OutfitListComponent },
  { path: 'new', component: OutfitFormComponent },
  { path: 'edit/:id', component: OutfitFormComponent },
  { path: ':id', component: OutfitDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutfitsRoutingModule { }
