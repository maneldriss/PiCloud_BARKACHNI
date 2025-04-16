import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { LayoutComponent } from './shared/layout/layout/layout.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { CommentaireListComponent } from './components/commentaire-list/commentaire-list.component';

const routes: Routes = [
  // page d'accueil
  { path: 'post', component: PostListComponent },
  { path: 'add-post', component: PostFormComponent },
  { path: 'post/:id/commentaires', component: CommentaireListComponent },

  { path: '**', redirectTo: '' } // Redirection si la route est inconnue
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }