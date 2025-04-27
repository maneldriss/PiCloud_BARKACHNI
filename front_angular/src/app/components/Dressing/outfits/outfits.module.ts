import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutfitsRoutingModule } from './outfits-routing.module';
import { OutfitListComponent } from './outfit-list/outfit-list.component';
import { OutfitDetailComponent } from './outfit-detail/outfit-detail.component';
import { OutfitFormComponent } from './outfit-form/outfit-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import {AIOutfitBuilderComponent} from "./ai-outfit-builder/ai-outfit-builder.component";
import {MatExpansionModule} from "@angular/material/expansion";
import { OutfitSwiperComponent } from './outfit-swiper/outfit-swiper.component';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  declarations: [
    OutfitListComponent,
    OutfitDetailComponent,
    OutfitFormComponent,
    AIOutfitBuilderComponent,
    OutfitSwiperComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OutfitsRoutingModule,
    SharedModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class OutfitsModule { }
