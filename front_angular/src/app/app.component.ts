import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth/auth.service'; 
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'PiLezelefons-angular';
  showChatbot = true;
  isDashboardPage: boolean = false;
  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.authService.initializeAuthState();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isDashboardPage = this.router.url.includes('/dashboard');
    });
  }

}