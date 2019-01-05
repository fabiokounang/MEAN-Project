import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  dataForm: FormGroup;
  isLoading: boolean = false;

  constructor (private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit () {
    this.dataForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    })
  }

  onLogin () {
    this.isLoading = true;
    if (this.dataForm.valid) {
      this.authService.login(this.dataForm.value).subscribe((response: any) => {
        if (response.status) {
          if (response.token) {
            const expiresIn = response.expiresIn;
            this.authService.setAuthTimer(expiresIn);
            this.authService.authListener.next(true);
            this.authService.isAuthenticate = true;
            this.authService.userId = response.userId;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.authService.saveAuthData(response.token, expirationDate, response.userId) ;
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        }
      }, (err) => {
        this.callSnackbar(err.error.message);
        this.isLoading = false;
      })
    }
  }

  callSnackbar (msg) {
    this.snackBar.open(msg, 'Okay', {
      duration: 2000
    })
  }
}