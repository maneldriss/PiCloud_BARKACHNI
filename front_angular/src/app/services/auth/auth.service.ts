import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { JwtService } from '../jwt/jwt.service';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { User } from '../../models/user'; // Importez votre interface User

interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    
  ){
    this.initializeAuthState();
  }

  initializeAuthState(): void {
    const token = this.jwtService.getToken();
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.persistAuthState(user);
        console.log('État auth restauré depuis le storage', user);
      } catch (e) {
        this.clearAuth();
      }
    }
  }  
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/authenticate`, credentials)
      .pipe(
        map(response => {
          this.jwtService.saveToken(response.token);
          
          // Si le backend renvoie les infos utilisateur dans la réponse
          if (response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            // Sinon, décoder le token
            const user = this.jwtService.decodeToken<User>(response.token);
            if (!user) throw new Error('Invalid token payload');
            this.currentUserSubject.next(user);
          }
          
          this.isAuthenticatedSubject.next(true);
          return this.currentUserSubject.value!;
        }),
        catchError(error => {
          console.error('Erreur lors de la requête:', error);
          return throwError(() => this.handleError(error));
        })
      );
  }

  logout(): void {
    this.jwtService.destroyToken();
  }
  clearAuth(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
  private handleError(error: any): string {
    if (error.error?.businessErrorDescription) {
      return error.error.businessErrorDescription;
    }
    if (error.error?.error) {
      return error.error.error;
    }
    return 'Une erreur inconnue est survenue';
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  isLoggedIn(): boolean {
    return !!this.jwtService.getToken();
  }
  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password/forgot`, { email });
  }
  
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password/reset`, {
      token,
      newPassword,
      confirmPassword
    });
  }
    // Méthode pour rafraîchir les données utilisateur si nécessaire
    refreshUserData(): void {
      const token = this.jwtService.getToken();
      if (token) {
        const user = this.jwtService.decodeToken<User>(token);
        if (user) {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } else {
          this.clearAuth();
        }
      } else {
        this.clearAuth();
      }
    }
    getUserProfile(): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/users/me`).pipe(
        map(user => {
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Error fetching user profile', error);
          return throwError(() => error);
        })
      );
    }
    confirm(confirmRequest: { token: string }): Observable<{ status: string, message: string }> {
      return this.http.post<{ status: string, message: string }>(
        `${this.apiUrl}/auth/activate-account`,
        confirmRequest,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }
      ).pipe(
        tap(response => {
          console.log('Réponse complète:', response);
        }),
        catchError(error => {
          console.error('Erreur:', error);
          return throwError(() => ({
            status: 'error',
            message: error.error?.message || 'Activation failed'
          }));
        })
      );
    }
    loginWithGoogle(): void {
      // Clear existing tokens
      this.jwtService.destroyToken();
      
      // Build the correct URL with context path
      const googleAuthUrl = `${environment.apiUrl}/oauth2/authorization/google`;
      
      // Redirect with proper state handling
      window.location.href = googleAuthUrl + 
        '?redirect_uri=' + encodeURIComponent(window.location.origin + '/oauth-redirect');
    }
    
    handleOAuth2Redirect(token: string): Observable<User> {
      return of(token).pipe(
        tap(t => this.jwtService.saveToken(t)),
        map(t => {
          const user = this.jwtService.decodeToken<User>(t);
          if (!user) throw new Error('Invalid token');
          this.persistAuthState(user); // <-- Persistance ici
          return user;
        }),
        tap(() => console.log('Connexion Google réussie - État mis à jour')),
        catchError(error => {
          this.clearPersistedAuthState();
          return throwError(() => error);
        })
      );
    }
    private persistAuthState(user: User): void {
      // Sauvegarde dans le state management
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      
      // Sauvegarde dans localStorage pour persistance
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('État auth sauvegardé', user);
    }
    private clearPersistedAuthState(): void {
      localStorage.removeItem('currentUser');
    }
    
    
}
