import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { LoginViewModel } from '../../../shared/models/loginViewModel';
import { AppConstants } from '../app.constants';

import { LocalStorageService } from './localstorage.service';
import { User } from '../../../shared/models/user';

import { JsonResponse } from '../../../shared/interfaces/jsonResponse';


@Injectable()
export class AuthService {
  private loggedIn: boolean = false;
  private finishFirstRun: boolean = false;
  private promise: Promise<any>;
  
  private loginUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.login;
  private logoutUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.logout;
  private statusUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.status;
  private googleLoginUrl = AppConstants.Server.url + AppConstants.Server.endpoint.login.googleLogin;

  constructor(private http: Http, private router: Router, private localStorageService: LocalStorageService) {
    //TODO Maybe this promise should be moved or angular gives some other opportunities for setting the loggedIn value 
    this.promise = this.http.get(this.statusUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        return this.setCurrentUserIfValid(response.json());
      })
      .catch(this.handleError);
  }
  
  googleLoginSucceed(auth_code: string): Promise<boolean> {
    return this.http.post(this.googleLoginUrl, { auth_code }, { withCredentials: true })
      .toPromise()
      .then(response => {
        return this.setCurrentUserIfValid(response.json());
      })
      .catch(this.handleError);
  }

  login(loginModel: LoginViewModel) : Promise<boolean> {
    console.log("service: loginModel: ", loginModel);

    return this.http.post(this.loginUrl, loginModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        const loggedIn = response.status == 200;
        return this.setCurrentUserIfValid(response.json());
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
        this.localStorageService.removeCurrentUser();
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
    if (!this.finishFirstRun) {
      return this.localStorageService.getCurrentUser() !== undefined;
    }
    return this.loggedIn;
  }

  private setCurrentUserIfValid(jsonObj: JsonResponse<User>): boolean {
    this.finishFirstRun = true;
    let user = jsonObj.data;
    let succes = jsonObj.succus;
    if (succes) {
      this.localStorageService.setCurrentUser(user);
    } else {
      this.localStorageService.removeCurrentUser();
    }
    this.loggedIn = succes;
    return succes;
  }

  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('AuthService - An error occurred', error);
    return Promise.reject(error.message || error);
  }
}