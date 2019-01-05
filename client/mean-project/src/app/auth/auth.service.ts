import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiString = 'http://localhost:3000/';
  private token: string = '';
  authListener = new Subject<boolean>();
  isAuthenticate = false;
  timer: any;
  userId: string = '';
  
  constructor (private http: HttpClient, private router: Router) {}

  getToken () {
    return this.token || localStorage.getItem('token');
  }

  saveToken (token) {
    this.token = token || localStorage.getItem('token');
  }

  signup (userData) {
    const authData: AuthData = {
      email: userData.email,
      password: userData.password
    };
    return this.http.post(this.apiString + 'api/users/signup', authData);
  }

  login (userData) {
    const authData: AuthData = {
      email: userData.email,
      password: userData.password
    };
    return this.http.post<{status: boolean, code: number, message: string, token: string, expiresIn: number, userId: string}>(this.apiString + 'api/users/login', authData);
  }

  autoAuthUser () {
    const authInformation = this.getAuthData();
    const now = new Date();

    if (!authInformation) {
      return;
    }
    
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticate = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authListener.next(true);
    }
    
  }

  setAuthTimer (duration: number) {
    this.timer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout () {
    this.token = null;
    this.isAuthenticate = false;
    this.userId = '';
    this.authListener.next(false);
    clearTimeout(this.timer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  saveAuthData (token: string, expirationDate: Date, userId: string) { // SAVE TOKEN AND EXPIRATION DATE TO LOCALSTORAGE
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString()); // to string karena value local storage hanya bisa menerima string
  }

  clearAuthData () {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }

  getAuthData () {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}