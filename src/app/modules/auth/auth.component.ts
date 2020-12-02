import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  signupMode: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.signupMode = false;
  }
  onLogin(form) {
    console.log(form.value);
    this.authService.login(form.value.username, form.value.password, form.value.signinFrom);
  }

  onSignup(form: NgForm) {
    console.log(form.value);
    this.authService.signup(form.value)
    .subscribe(resData => {
      console.log(resData);
      this.signupMode = false;
      alert(resData.message);
  });
  }

  onSignupLink() {
    this.signupMode = true;
  }

  onCloseSignup() {
    this.signupMode = false;
  }
}
