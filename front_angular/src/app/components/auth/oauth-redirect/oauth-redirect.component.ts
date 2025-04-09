import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-oauth-redirect',
  templateUrl: './oauth-redirect.component.html',
  styleUrls: ['./oauth-redirect.component.css'],
    template: '<p>Redirection en cours...</p>'
})
export class OauthRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      console.log('OAuth Redirect Params:', params);
      
      if (params['error']) {
        console.error('OAuth Error:', params['error']);
        this.router.navigate(['/login'], { 
          state: { error: params['error'] } 
        });
        return;
      }

      const token = params['token'];
      if (!token) {
        console.error('No token provided');
        this.router.navigate(['/login'], { 
          state: { error: 'Authentication failed: no token received' } 
        });
        return;
      }

      console.log('Processing token...');
      this.authService.handleOAuth2Redirect(token).subscribe({
        next: (user) => {
          console.log('Authentication successful, user:', user);
          // Force reload to ensure all components update
          window.location.href = '/';
        },
        error: (err) => {
          console.error('Authentication error:', err);
          this.router.navigate(['/login'], { 
            state: { error: err.message || 'Authentication failed' } 
          });
        }
      });
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
