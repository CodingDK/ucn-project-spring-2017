import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';


import { LessonService } from '../../services/lesson.service';
import { LessonConfirmModalComponent } from '../shared/lesson-confirm-modal.component';

import { ILesson } from '../../../../../shared/interfaces/iModels';


@Component({
  selector: 'lesson-admin-delete-modal',
  templateUrl: './lesson-admin-delete-modal.component.html',
  styleUrls: ['./lesson-admin-delete-modal.component.scss']
})
export class LessonAdminDeleteModalComponent implements OnInit {
  @ViewChild(LessonConfirmModalComponent)
  deleteModal: LessonConfirmModalComponent;

  item: ILesson;

  constructor(private lessonService: LessonService, private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const item = this.lessonService.getLessonById(id);
      if (item === undefined) {
        this.router.navigate(['/lesson'], { relativeTo: this.route, replaceUrl: true });
        this.notFoundToasty();
      } else {
        this.item = item;
      }
    });
    
  }
    
  public onHidden(): void {
    this.router.navigate(['/lesson'], { relativeTo: this.route});
  }

  public onConfirmedDelete(event: any) {
    this.lessonService.deleteLesson(this.item.id)
      .then((deleted: boolean) => {
        this.deleteModal.hideModal();
        if (deleted) {
          this.toastyService.success("Lektiecaf&eacute;en er blevet slettet");
        } else {
          this.notFoundToasty();
        }
      })
      .catch((err: any) => {
        let body = JSON.parse(err._body);
        this.toastyService.error(<ToastOptions>{
          title: "Der opstod en fejl",
          msg: body.message
        });
      });
  }

  public notFoundToasty() {
    this.toastyService.info("Lektiecaf&eacute;en blev ikke fundet, og er muligvis allerede slettet");
  }
}

