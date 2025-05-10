import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

   private apiUrl = 'http://localhost:8089/pi/user'; // adjust if different
  
    constructor(private http: HttpClient) {}
  
  
  
    getUserById(id: number): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/retrieve-user/${id}`);
    }
  }
  