import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { ToastyService } from 'ng2-toasty';

import { LessonService } from './lesson.service';
import { ILesson } from '../../../../shared/interfaces/iModels';

@Injectable()
export class LessonDetailResolver implements Resolve<ILesson> {

  constructor(private ls: LessonService, private route: ActivatedRoute, private router: Router, private toastyService: ToastyService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ILesson> {
    let id = route.params['id'];
    let populateStudent = route.data['populateStudent'];
    let populateTeacher = route.data['populateTeacher'];
    
    return this.ls.getLessonById(id, populateTeacher, populateStudent).then(lesson => {
      if (lesson) {
        return lesson;
      } else { // id not found
        this.router.navigate(['/lesson'], { relativeTo: this.route, replaceUrl: true });
        this.toastyService.info("Lektiecaf&eacute;en blev ikke fundet");
        return null;
      }
    });
  }
}