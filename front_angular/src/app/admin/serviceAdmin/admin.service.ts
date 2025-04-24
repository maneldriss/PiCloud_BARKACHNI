import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl2}`;
  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/Allusers`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      })
    }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to load users'));
      })
    );
  }
  updateUserStatus(userId: number, enabled: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/status`, { enabled }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      })
    }).pipe(
      catchError(error => {
        console.error('Error updating user status:', error);
        return throwError(() => new Error('Failed to update user status'));
      })
    );
  }

  updateAccountLockStatus(userId: number, locked: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/lock`, { locked }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      })
    }).pipe(
      catchError(error => {
        console.error('Error updating account lock status:', error);
        return throwError(() => new Error('Failed to update account lock status'));
      })
    );
  }
}
