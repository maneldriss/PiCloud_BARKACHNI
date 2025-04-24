import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  message = '';
  isOkay = true;
  welcomeMessages = [
    "Welcome to Bar9achni - Your fashion destination",
    "Discover the latest trends with Bar9achni",
    "Premium fashion for everyone",
    "Your style journey starts here"
  ];
  fashionTips = [
    "New collection just arrived!",
    "Get 20% off on your first purchase",
    "Trending now: Bohemian style dresses",
    "Limited edition sneakers available",
    "Your style is our inspiration",
    "Fashion fades, style is eternal"
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.showWelcomeNotification();
  }

  showWelcomeNotification() {
    const welcomeMsg = this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)];
    this.message = welcomeMsg;
    this.isOkay = true;
    
    // Show random fashion tip after 5 seconds
    setTimeout(() => {
      this.dismissNotification();
      setTimeout(() => {
        const randomTip = this.fashionTips[Math.floor(Math.random() * this.fashionTips.length)];
        this.message = randomTip;
        this.isOkay = true;
      }, 1000);
    }, 5000);
  }
  dismissNotification() {
    this.message = '';
  }
  showErrorNotification(errorMsg: string) {
    this.message = errorMsg;
    this.isOkay = false;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (data ) => {
        console.log('✅ Authentification réussie!'); // Message de succès
        console.log('Token JWT stocké avec succès');
        this.isLoading = false;
        
        // Redirection (si gérée dans le composant plutôt que le service)
        this.router.navigate(['/profile']);

      },
      error: (err) => {
        console.error('❌ Erreur d\'authentification:', err); // Message d'erreur
        this.errorMessage = err;
        this.isLoading = false;
      }
    });
  }
  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}