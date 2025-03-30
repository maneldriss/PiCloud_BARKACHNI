import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DressingDetailComponent} from "./dressing-detail/dressing-detail.component";
import {DressingFormComponent} from "./dressing-form/dressing-form.component";

const routes: Routes = [
  { path: '', component: DressingDetailComponent },
  { path: 'edit', component: DressingFormComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DressingRoutingModule { }
