import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(public authService: AuthService, private router: Router,  cdr: ChangeDetectorRef) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.cdr = cdr;
  }

  ngOnInit(): void {
    console.log('Initialisation Layout - Chargement état auth');
    
    // Synchronisation immédiate
    this.authService.initializeAuthState();
    
    // Abonnement aux changements
    this.authService.currentUser$.subscribe(user => {
      console.log('Changement état user:', user ? 'Connecté' : 'Déconnecté');
      this.cdr.detectChanges(); // Maintenant cela fonctionnera
    });

    this.authService.isAuthenticated$.subscribe(() => {
      this.cdr.detectChanges(); // Force aussi la détection pour isAuthenticated
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
 

  ngOnDestroy() {
    window.removeEventListener('storage', this.handleStorageEvent);
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