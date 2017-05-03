import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { AppConstants } from '../app.constants';

import { User } from '../../../shared/models/user';



@Injectable()
export class LocalStorageService {
  private USER_KEY = 'currentUser';

  constructor() {
    
  }

  getCurrentUser(): User | undefined {
    let value = localStorage.getItem(this.USER_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
    return undefined;
  }

  setCurrentUser(user: User) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeCurrentUser() {
    localStorage.removeItem(this.USER_KEY);
  }
}