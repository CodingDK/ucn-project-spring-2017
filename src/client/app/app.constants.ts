import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {
  public static Server = {
    url: 'http://localhost:3000/api/',
    endpoint: {
      login: {
        login: 'login/',
        logout: 'login/logout/',
        status: 'login/status/',
        googleLogin: 'login/auth/google'
      },
      github: {
        commits: 'github/commits'
      }
    }
  };
}