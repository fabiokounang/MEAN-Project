import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  subscription:Subscription;
  isAuthenticate: boolean = false;
  constructor (private authService: AuthService, private router: Router) {}

  ngOnInit () {
    this.isAuthenticate = this.authService.isAuthenticate;
    this.subscription = this.authService.authListener.subscribe((condition) => {
      this.isAuthenticate = condition;
    })
  }

  onLogout () {
    this.authService.logout();
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}