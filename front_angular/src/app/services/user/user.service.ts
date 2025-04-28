import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { JwtService } from '../jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl2;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`
    });
    return this.http.get<User>(`${this.apiUrl}/users/meu`, { headers });
  }

  updateUser(userData: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`
    });
    return this.http.put<User>(`${this.apiUrl}/users/me`, userData, { headers });
  }

  deleteUser(): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`
    });
    return this.http.delete<void>(`${this.apiUrl}/users/me`, { headers });
  }
}