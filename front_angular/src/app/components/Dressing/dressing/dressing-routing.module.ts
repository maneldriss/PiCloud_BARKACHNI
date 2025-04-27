import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DressingComponent} from "./dressing.component";

const routes: Routes = [
  { path: '', component: DressingComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DressingRoutingModule { }
