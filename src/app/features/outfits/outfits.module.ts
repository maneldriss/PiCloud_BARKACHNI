import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutfitsRoutingModule } from './outfits-routing.module';
import { OutfitListComponent } from './outfit-list/outfit-list.component';
import { OutfitDetailComponent } from './outfit-detail/outfit-detail.component';
import { OutfitFormComponent } from './outfit-form/outfit-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    OutfitListComponent,
    OutfitDetailComponent,
    OutfitFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OutfitsRoutingModule,
    SharedModule
  ]
})
export class OutfitsModule { }
