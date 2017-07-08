import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { ILesson, IMeetUp } from '../../../../shared/interfaces/iModels';
import { AppConstants } from "../../app.constants";

import { CreateLessonViewModel } from '../../models/viewmodels/createLessonViewModel';
import { AuthService } from "../../services/auth.service";
import { Roles } from "../../../../shared/constants/roles";

@Injectable()
export class LessonService {
  private lessonUrl = AppConstants.Server.url + "lesson/";

  private populateStudent: boolean | undefined;
  private onlyActive: boolean | undefined;
  private allLessons: ILesson[] = [];

  constructor(
    private authService: AuthService,
    private http: Http,
    private router: Router,
    private toastyService: ToastyService) { }

  getAllLessons(): ILesson[] {
    return this.allLessons;
  }

  refreshAllLessons(populateTeacher: boolean = true, populateStudent?: boolean, onlyActive?: boolean): Promise<ILesson[]> {
    if (populateStudent !== undefined) {
      this.populateStudent = populateStudent;
    }
    if (onlyActive !== undefined) {
      this.onlyActive = onlyActive;
    }

    return this.http
      .get(this.lessonUrl, {
        params: {
          populateTeacher,
          populateStudent: this.populateStudent,
          onlyActive: this.onlyActive
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

  updateMeetUp(lessonId: string, meetUp: IMeetUp): Promise<IMeetUp> {
    const url = this.getUpdateMeetUpUrl(lessonId, meetUp.student.id);
    return this.http.put(url, meetUp, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((newMeetUp: IMeetUp) => {
        //TODO maybe refresh allLesson? (or just this meetUp)
        //right now it happen in the components (updating the meetUp only)
        return newMeetUp;
      })
      .catch(this.handleError.bind(this));
  }

  updateMeetUpTopic(lessonId: string, topic: string | undefined): Promise<IMeetUp> {
    const url = this.getUpdateMeetUpUrl(lessonId, undefined, "topic");
    return this.http.put(url, <IMeetUp>{ topic }, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((newMeetUp: IMeetUp) => {
        //TODO maybe refresh allLesson? (or just this meetUp)
        //right now it happen in the components (updating the meetUp only)
        return newMeetUp;
      })
      .catch(this.handleError.bind(this));
  }

  addMeetUpCheckInOrOut(lessonId: string, isCheckIn: boolean): Promise<IMeetUp> {
    const action = isCheckIn ? "checkin" : "checkout";
    const url = this.getUpdateMeetUpUrl(lessonId, undefined, action);
    return this.http.post(url, undefined, { withCredentials: true })
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .then((newMeetUp: IMeetUp) => {
        //TODO maybe refresh allLesson? (or just this meetUp)
        //right now it happen in the components (updating the meetUp only)
        return newMeetUp;
      })
      .catch(this.handleError.bind(this));
  }

  private getUpdateMeetUpUrl(lessonId: string, studentId?: string, action?: "checkin" | "checkout" | "topic") {
    let url = `${this.lessonUrl + lessonId}/meetup`;
    const isStudent = this.authService.isUserInRole(Roles.student);
    if (studentId && !isStudent) {
      url += `/${studentId}`;
    }
    if (isStudent && action) {
      url += `/${action}`;
    }
    return url;
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
