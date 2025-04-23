import { NgModule } from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {CoreModule} from "./core/core.module";
import {SharedModule} from "./shared/shared.module";
import {AIOutfitRecommendationService} from "./core/services/ai-outfit-recommendation.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    HammerModule
  ],
  providers: [
    AIOutfitRecommendationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
