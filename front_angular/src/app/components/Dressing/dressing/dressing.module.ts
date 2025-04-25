import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DressingRoutingModule } from './dressing-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {DressingComponent} from "./dressing.component";


@NgModule({
  declarations: [
    DressingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DressingRoutingModule,
    SharedModule
  ]
})
export class DressingModule { }
