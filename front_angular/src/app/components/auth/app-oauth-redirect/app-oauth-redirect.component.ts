import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-app-oauth-redirect',
  templateUrl: './app-oauth-redirect.component.html',
  styleUrls: ['./app-oauth-redirect.component.css']
})
export class AppOauthRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('[Google Redirect] Initialisation du composant');
    
    this.route.queryParams.subscribe({
      next: (params) => {
        console.log('[Google Redirect] Paramètres reçus:', params);
        
        if (params['error']) {
          console.error('[Google Redirect] Erreur de connexion:', params['error']);
          this.handleOAuthError(params['error']);
          return;
        }
        
        const token = params['token'];
        if (!token) {
          console.error('[Google Redirect] Token manquant dans les paramètres');
          this.router.navigate(['/login'], { 
            state: { error: 'Token manquant' } 
          });
          return;
        }
        
        console.log('[Google Redirect] Traitement du token...');
        this.authService.handleOAuth2Redirect(token).subscribe({
          next: (user) => {
            console.log('[Google Redirect] Connexion Google réussie! ✅', {
              user: user,
              redirectTo: '/'
            });
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('[Google Redirect] Échec de la connexion Google:', err);
            this.handleOAuthError(err);
          }
        });
      },
      error: (err) => {
        console.error('[Google Redirect] Erreur de lecture des paramètres:', err);
      }
    });
  }

  private handleOAuthError(error: any): void {
    console.error('OAuth Error:', error);
    this.router.navigate(['/login'], { 
      state: { error: 'Google login failed. Please try again.' } 
    });
  }
}