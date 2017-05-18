import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { AppConstants } from '../app.constants';

import { IUser } from '../../../shared/interfaces/iModels';


@Injectable()
export class LocalStorageService {
  private USER_KEY = 'currentUser';

  constructor() {
    
  }

  getCurrentUser(): IUser | undefined {
    let value = localStorage.getItem(this.USER_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
    return undefined;
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeCurrentUser() {
    localStorage.removeItem(this.USER_KEY);
  }
}