import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { LoginViewModel } from '../../../shared/models/loginViewModel';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  model = new LoginViewModel("", "");
  isSubmitted = false;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    
  }

  submit() {
    this.isSubmitted = true;
    const lessonModel = this.model;
    this.model = new LoginViewModel(lessonModel.email, "");
    this.authService.login(lessonModel)
      .then(response => {
        this.router.navigateByUrl('/lesson');
      }).catch(err => {
        if (err.status == 401) {
          this.errorMessage = "Wrong Username or password";
        } else {
          this.errorMessage = `Unknown Error - code: ${err.status} - ${err.statusText}`;
        }
      });
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }
}
