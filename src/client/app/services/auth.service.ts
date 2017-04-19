import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { LoginViewModel } from '../../../shared/models/loginViewModel';
import { AppConstants} from '../app.constants';


@Injectable()
export class AuthService {
  private loggedIn: boolean = false;
  private finishFirstRun: boolean = false;
  private promise: Promise<any>;

  private loginUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.login;
  private logoutUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.logout;
  private statusUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.status;
  private googleLoginUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.googleLogin;

  constructor(private http: Http, private router: Router) {
    //TODO Maybe this promise should be moved or angular gives some other opportunities for setting the loggedIn value 
    this.promise = this.http.get(this.statusUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        this.loggedIn = response.json().login;
        return this.loggedIn;
      })
      .catch(this.handleError);
  }


  googleLoginSucceed(id_token: string): Promise<boolean> {
    return this.http.post(this.googleLoginUrl, { id_token }, { withCredentials: true })
      .toPromise()
      .then(response => {
        this.loggedIn = response.json().login;
        return this.loggedIn;
      })
      .catch(this.handleError);
  }

  login(loginModel: LoginViewModel) : Promise<boolean> {
    console.log("service: loginModel: ", loginModel);

    return this.http.post(this.loginUrl, loginModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        const loggedIn = response.status == 200;
        this.finishFirstRun = true;
        this.loggedIn = loggedIn;
        //console.log("response", response);
        //console.log("responseJson", response.json());
        return loggedIn;
      });
  }

  // This method will log the use out
  logout() {
    this.http.get(this.logoutUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        //const loggedIn = response.status == 200;
        //console.log("response", response);
        //console.log("responseJson", response.json());
        this.loggedIn = false;
      })
      .catch(this.handleError);
    this.router.navigateByUrl('/login');
  }
  
  isLoggedInAsPromise(): Promise<boolean> {
    if (this.finishFirstRun) {
      return new Promise<boolean>(response => { return this.isLoggedIn });
    }
    return this.promise;

  }

  isFinishFirstRun(): boolean {
    return this.finishFirstRun;
  }
  
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  
  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('AuthService - An error occurred', error);
    return Promise.reject(error.message || error);
  }
}