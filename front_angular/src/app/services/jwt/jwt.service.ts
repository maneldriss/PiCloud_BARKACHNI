import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_KEY = 'access_token';

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? token.replace(/^"(.*)"$/, '$1').trim() : null;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  destroyToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  decodeToken<T>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as T;
    } catch (e) {
      console.error('Error decoding JWT token', e);
      return null;
    }
  }
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken<any>(token);
      if (!decoded || !decoded.exp) return true;
      
      const expirationDate = new Date();
      expirationDate.setUTCSeconds(decoded.exp);
      return expirationDate.valueOf() < new Date().valueOf();
    } catch (e) {
      return true;
    }
  }
}