import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RoleName } from '../models/role.model';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.currentUserValue;
    if (user && user.roles && user.roles.some(role => role.name === RoleName.ADMIN)) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}