import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { JwtService } from '../jwt/jwt.service';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import { User } from '../../models/user'; // Importez votre interface User
import { Router } from '@angular/router';

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
  user: User;
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
  private apiUrl2= `${environment.apiUrl2}`;
  user!: User;
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
    
  ){
    this.initializeAuthState();
  }

  initializeAuthState(): void {
    const token = this.jwtService.getToken();
    
    if (!token || this.jwtService.isTokenExpired(token)) {
      console.log("Im @ clear auth")
      this.clearAuth();
      return;
    }
  
    // Récupérer l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('currentUser');
     if (savedUser!=null) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        // Rafraîchir les données depuis le serveur
         } catch (e) {
        console.error('Error parsing saved user', e);
        this.clearAuth();
      }
    } else {
      // Si pas d'utilisateur en localStorage mais token valide
      this.getUserProfile().subscribe({
        next: (user) => {
          console.log('Utilisateur récupéré depuis le serveur:', user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
        },
        error: () => {
          this.clearAuth();
        }
      });
    }
  }
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, userData);
  }
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return !!(user && user.roles && user.roles.some(role => role.name === 'ADMIN'));
  }
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/authenticate`, credentials)
      .pipe(
        tap(response => {
          this.jwtService.saveToken(response.token);
          this.isAuthenticatedSubject.next(true);
          console.log("response from backend ", response);
          
          // Make sure roles are properly stored
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        map(() => this.currentUserSubject.value!),
        catchError(error => {
          console.error('Erreur lors de la requête:', error);
          return throwError(() => this.handleError(error));
        })
      );
  }

  logout(): Observable<void> {
    // Inclure le token dans les headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`
    });
  
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}, { headers }).pipe(
      tap(() => {
        this.clearAuth();
      }),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }
  clearAuth(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('currentUser');
    this.jwtService.destroyToken();
    // Redirigez vers la page de login si nécessaire
   // this.router.navigate(['/login']);
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
    this.currentUserSubject.subscribe((data)=>console.log(data))
    console.log('Utilisateur actuel:', this.currentUserSubject.value);
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
      return this.http.get<User>(`${this.apiUrl2}/users/meu`)
      
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


          console.log(error);
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
   
    
    uploadImage(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
    
      return this.http.post(`${environment.apiUrl}/api/users/me/profile-picture`, formData, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.jwtService.getToken()}`
        }),
        withCredentials: true
      }).pipe(
        catchError(error => {
          if (error.status === 401) {
            // Clear invalid token and redirect to login
            this.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    updateUserProfile(credentials: { profilePicture: string }): Observable<User> {
      return this.http.put<User>(
        `${this.apiUrl2}/users/me`,
        credentials,
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${this.jwtService.getToken()}`,
            'Content-Type': 'application/json'
          })
        }
      ).pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
    }
    
}
