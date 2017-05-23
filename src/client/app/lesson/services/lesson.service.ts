import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { ILesson } from '../../../../shared/interfaces/iModels';
import { AppConstants } from "../../app.constants";

import { CreateLessonViewModel } from '../../models/viewmodels/createLessonViewModel';

@Injectable()
export class LessonService {
  private lessonUrl = AppConstants.Server.url + "lesson/";
  private allLessons: ILesson[] = [];

  constructor(private http: Http, private router: Router, private toastyService: ToastyService) {
    this.init();
  }

  init() {
    this.refreshAllLessons();
  }

  refreshAllLessons(): void {
    this.http
      .get(this.lessonUrl, {
        params: {
          populateTeacher: true
        },
        withCredentials: true
      })
      .toPromise()
      .then(response => {
        this.allLessons = response.json().data;
        return response.json();
      })
      .catch(this.handleError.bind(this));
  }

  getAllLessons(): ILesson[] {
    return this.allLessons;
  }

  getLessonById(id: string, populateTeacher: boolean = true, populateStudent?: boolean): Promise<ILesson> {
    return this.http
      .get(this.lessonUrl + id, {
        params: {
          populateTeacher,
          populateStudent
        },
        withCredentials: true
      })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .catch(this.handleError.bind(this));
    //return this.allLessons.find(value => { return value.id === id });
  }

  createLesson(viewModel: CreateLessonViewModel): Promise<ILesson> {
    return this.http.post(this.lessonUrl, viewModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((lesson: ILesson) => {
        this.refreshAllLessons();
        return lesson;
      })
      .catch(this.handleError.bind(this));
  }

  updateLesson(viewModel: CreateLessonViewModel): Promise<ILesson> {
    return this.http.put(this.lessonUrl, viewModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((lesson: ILesson) => {
        this.refreshAllLessons();
        return lesson;
      })
      .catch(this.handleError.bind(this));
  }

  deleteLesson(id: string): Promise<boolean> {
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