import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { Lesson } from '../../../../shared/models/lesson';
import { AppConstants } from "../../app.constants";

@Injectable()
export class TempService {
  private lessonUrl = AppConstants.Server.url + "lesson/";
  private allLessons: Lesson[] = [];

  constructor(private http: Http, private router: Router) {
    this.init();
  }

  init() {
    this.refreshAllLessons();
  }

  refreshAllLessons(): void {
    this.http.get(this.lessonUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        this.allLessons = response.json().data;
        return response.json();
      })
      .catch(this.handleError.bind(this));
  }

  getAllLessons(): Lesson[] {
    return this.allLessons;
  }

  // Implement a method to handle errors if any
  private handleError(error: any): void {
    console.error('TempService - An error occurred', error);
    if (error.status === 401) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }
}