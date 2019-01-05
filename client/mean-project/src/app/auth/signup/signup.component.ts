import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  dataForm: FormGroup;
  isLoading: boolean = false;

  constructor (private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit () {
    this.dataForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    })
  }

  onSignup () {
    this.isLoading = true;
    if (this.dataForm.valid) {
      this.authService.signup(this.dataForm.value).subscribe((response: any) => {
        if (response.status) {
          this.isLoading = false;
          this.callSnackbar(response.message);
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