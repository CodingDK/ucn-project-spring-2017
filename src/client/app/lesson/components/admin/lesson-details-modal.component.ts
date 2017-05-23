import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';


import { LessonService } from '../../services/lesson.service';
import { LessonConfirmModalComponent } from '../shared/lesson-confirm-modal.component';

import { ILesson } from '../../../../../shared/interfaces/iModels';


@Component({
  selector: 'lesson-details-delete-modal',
  templateUrl: './lesson-details-modal.component.html',
  styleUrls: ['./lesson-details-modal.component.scss']
})
export class LessonDetailsModalComponent implements OnInit {
  @ViewChild(LessonConfirmModalComponent)
  deleteModal: LessonConfirmModalComponent;

  item: ILesson;

  constructor(private lessonService: LessonService, private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { lesson: ILesson }) => {
        this.item = data.lesson;
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
          this.toastyService.info("Lektiecaf&eacute;en blev ikke fundet, og er muligvis allerede slettet");
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
}

