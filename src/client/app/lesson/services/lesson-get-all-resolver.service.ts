import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { ToastyService } from 'ng2-toasty';

import { LessonService } from './lesson.service';
import { ILesson } from '../../../../shared/interfaces/iModels';
import { AuthService } from "../../services/auth.service";

@Injectable()
export class LessonGetAllResolver implements Resolve<ILesson[]> {

  constructor(
    private ls: LessonService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ILesson[]> {
    //const populateStudent = route.data['populateStudent'];
    //const populateTeacher = route.data['populateTeacher'];
    //const onlyActive = route.data['onlyActive'];
    const populateTeacher = true;
    let populateStudent;
    let onlyActive;
    if (this.authService.isUserInRole("student")) {
      populateStudent = true;
      onlyActive = true;
    }
    return this.ls.refreshAllLessons(populateTeacher, populateStudent, onlyActive);
  }
}
