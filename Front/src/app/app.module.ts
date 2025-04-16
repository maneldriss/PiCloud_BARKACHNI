import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './shared/layout/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { CommentaireListComponent } from './components/commentaire-list/commentaire-list.component';




@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    LayoutComponent,
    HomeComponent,
    PostFormComponent,
   
    CommentaireListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
