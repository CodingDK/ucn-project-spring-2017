import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';

// Google's login API namespace
declare const gapi: any;

@Component({
  selector: 'login-google',
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss']
})
export class LoginGoogleComponent implements AfterViewInit {
  public googleLoginButtonId = "google-login-button";
  public errorMessage: string;

  private clientId: string = environment.GOOGLE_CLIENT_ID;

  private scope = [
    'profile',
    'email'
  ].join(' ');
  
  public auth2: any;

  constructor(private authService: AuthService, private router: Router, private _zone: NgZone) {

  }

  ngAfterViewInit() {
    this.googleInit();
  }
    
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      });
      this.attachSignin();
    });
  }
  public attachSignin() {
    let element = document.getElementById(this.googleLoginButtonId);
    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        this._zone.run(() => {
          let id_token = googleUser.getAuthResponse().id_token;
          this.authService.googleLoginSucceed(id_token).then(response => {
            this.router.navigateByUrl('/github');
          }).catch(err => {
            try {
              this.errorMessage = JSON.parse(err._body).message;
            } catch (e) {
              this.errorMessage = `Unknown Error - code: ${err.status} - ${err.statusText}`;
            }
          });
        });
        
        //let profile = googleUser.getBasicProfile();
        //console.log('Token || ' + googleUser.getAuthResponse().id_token);
        //console.log('ID: ' + profile.getId());
        //console.log('Name: ' + profile.getName());
        //console.log('Image URL: ' + profile.getImageUrl());
        //console.log('Email: ' + profile.getEmail());
        
      }, (error: any) => {
        console.log("attachSignin Error: ", JSON.stringify(error, undefined, 2));
      });
  }

  /*
  submit() {
    this.isSubmitted = true;
    const tempModel = this.model;
    this.model = new LoginViewModel(tempModel.email, "");
    this.authService.login(tempModel)
      .then(response => {
        this.router.navigateByUrl('/github');
      }).catch(err => {
        if (err.status == 401) {
          this.errorMessage = "Wrong Username or password";
        } else {
          this.errorMessage = `Unknown Error - code: ${err.status} - ${err.statusText}`;
        }
      });
  }*/
}
