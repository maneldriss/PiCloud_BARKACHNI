import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule 
  ],
  exports: [LayoutComponent] // Permet d'utiliser le composant ailleurs
})
export class SharedModule { }