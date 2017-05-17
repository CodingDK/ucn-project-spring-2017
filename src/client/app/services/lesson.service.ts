import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { Lesson } from '../../../shared/models/lesson';
import { AppConstants } from "../app.constants";

import { CreateLessonViewModel } from '../viewmodels/createLessonViewModel';

@Injectable()
export class LessonService {
  private lessonUrl = AppConstants.Server.url + "lesson/";
  private allLessons: Lesson[] = [];

  constructor(private http: Http, private router: Router, private toastyService: ToastyService) {
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

  getLessonById(id: string): Lesson | undefined {
    return this.allLessons.find(value => { return value.id === id });
  }

  createLesson(viewModel: CreateLessonViewModel): Promise<Lesson> {
    return this.http.post(this.lessonUrl, viewModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((lesson: Lesson) => {
        this.refreshAllLessons();
        return lesson;
      })
      .catch(this.handleError.bind(this));
  }

  deleteLesson(id: string) : Promise<boolean> {
    return this.http.delete(this.lessonUrl + id, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((deleted: boolean) => {
        this.refreshAllLessons();
        return deleted;
      })
      .catch(this.handleError.bind(this));
  }

  // Implement a method to handle errors if any
  private handleError(error: any): void {
    console.error('LessonService - An error occurred', error);
    if (error.status === 401) {
      this.toastyService.error("Du er ikke logget ind eller også har du ikke adgang til funtionen");
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      throw error;
    }
  }
}