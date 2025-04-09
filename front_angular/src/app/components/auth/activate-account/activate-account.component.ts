import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', 
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]

})
export class ActivateAccountComponent {
  message = '';
  isOkay = false;
  submitted = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  private confirmAccount(token: string) {
    console.log('Token reçu dans confirmAccount:', token); // Ajout du log
    this.isLoading = true;
    this.authService.confirm({ token }).subscribe({
      next: () => {
        console.log('Activation réussie avec token:', token); // Log de succès
        this.message = 'Your account has been successfully activated. Now you can proceed to login';
        this.isOkay = true;
        this.submitted = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur d\'activation avec token:', token, 'Erreur:', error); // Log d'erreur
        this.message = error.error?.message || 'Token has expired or is invalid';
        this.isOkay = false;
        this.submitted = true;
        this.isLoading = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {
    console.log('Traitement du token:', token);
    
    if (token.length !== 6) {
      this.message = 'Le code doit contenir exactement 6 chiffres';
      this.isOkay = false;
      return;
    }
  
    this.isLoading = true;
    
    this.authService.confirm({ token }).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.message = response.message;
        this.isOkay = response.status === 'success';
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.message = err.message || 'Erreur lors de l\'activation';
        this.isOkay = false;
      },
      complete: () => {
        this.isLoading = false;
        this.submitted = true;
      }
    });
  }
}