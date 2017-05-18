import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';


import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { IUser, ISchoolClass } from '../../../shared/interfaces/iModels';
import { AppConstants } from "../app.constants";


@Injectable()
export class UserService {
  private userUrl = AppConstants.Server.url + "user/";
  
  constructor(private http: Http, private router: Router, private toastyService: ToastyService) {
    this.init();
  }

  private init() {

  }

  public getAllUsers(roles?: string[]): Promise<IUser[]> {
    return this.http.get(this.userUrl, { params: {roles}, withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .catch(this.handleError.bind(this));
  }

  public getAllSchoolClasses(): Promise<ISchoolClass[]> {
    return new Promise<ISchoolClass[]>((resolve) => {
      return resolve(require("../../../shared/data/schoolClasses.json"));
    });
  }
  
  
  // Implement a method to handle errors if any
  private handleError(error: any): void {
    console.error('UserService - An error occurred', error);
    if (error.status === 401) {
      this.toastyService.error("Du er ikke logget ind eller også har du ikke adgang til funtionen");
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      throw error;
    }
  }
}