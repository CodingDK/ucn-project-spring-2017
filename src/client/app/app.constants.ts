import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {
  public static Server = {
    url: 'http://localhost:3000/api/',
    endpoint: {
      login: {
        login: 'login/',
        logout: 'login/logout/',
        status: 'login/status/'
      },
      github: {
        commits: 'github/commits'
      }
    }
  };
}