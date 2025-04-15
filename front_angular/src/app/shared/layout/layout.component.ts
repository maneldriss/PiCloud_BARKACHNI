import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JwtService } from '../../services/jwt/jwt.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  private cdr!: ChangeDetectorRef; 
  private authSubscriptions: Subscription[] = [];
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
 

  constructor(public authService: AuthService, private router: Router,  cdr: ChangeDetectorRef, private jwtService: JwtService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.cdr = cdr;
  }

  ngOnInit(): void {
    console.log('Initialisation Layout - Chargement état auth');
    this.updateAuthState();
    
    // Abonnement aux changements
    this.authSubscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.cdr.detectChanges();
      })
    );

    this.authSubscriptions.push(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (!isAuth) this.currentUser = null;
        this.cdr.detectChanges();
      })
    );
  }

  private updateAuthState(): void {
    const token = this.jwtService.getToken();
    if (token) {
      this.isAuthenticated = true;
      this.currentUser = this.authService.getCurrentUser();
      
      // Si token valide mais user null, forcer le chargement
      if (!this.currentUser) {
        this.authService.getUserProfile().subscribe();
      }
    }
  }
  async logout(): Promise<void> {
    try {
      await this.authService.logout().toPromise();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
      this.router.navigate(['/login']);
    } finally {
      this.cdr.detectChanges();
    }
  }
  ngOnDestroy() {
    this.authSubscriptions.forEach(sub => sub.unsubscribe());
  }

  private listenToStorageEvents() {
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key === 'oauth_redirect') {
      console.log('Storage event detected, refreshing auth state...');
      this.authService.refreshUserData();
    }
  }
}