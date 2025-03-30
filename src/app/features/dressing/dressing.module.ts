import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DressingRoutingModule } from './dressing-routing.module';
import { DressingDetailComponent } from './dressing-detail/dressing-detail.component';
import { DressingFormComponent } from './dressing-form/dressing-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    DressingDetailComponent,
    DressingFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DressingRoutingModule,
    SharedModule
  ]
})
export class DressingModule { }
