import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';


import { LessonService } from '../../services/lesson.service';
import { LessonConfirmModalComponent } from '../shared/lesson-confirm-modal.component';

import { ILesson, IMeetUp } from '../../../../../shared/interfaces/iModels';


@Component({
  selector: 'lesson-details-delete-modal',
  templateUrl: './lesson-details-modal.component.html',
  styleUrls: ['./lesson-details-modal.component.scss']
})
export class LessonDetailsModalComponent implements OnInit {
  @ViewChild('detailsModal')
  detailsModal: ModalDirective;

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

  public hideModal(): void {
    this.detailsModal.hide();
  }

  public onHidden(): void {
    this.router.navigate(['/lesson'], { relativeTo: this.route });
  }

  public checkClicked(m: IMeetUp, isCheckIn: boolean) {
    const newMeetUp = <IMeetUp>{
      checkIn: m.checkIn,
      checkOut: m.checkOut,
      student: m.student,
      topic: m.topic
    }
    if (isCheckIn) {
      newMeetUp.checkIn = new Date();
    } else {
      newMeetUp.checkOut = new Date();
    }
    this.lessonService.updateMeetUp(this.item.id, newMeetUp)
      .then(returnedMeetUp => {
        m.checkIn = returnedMeetUp.checkIn;
        m.checkOut = returnedMeetUp.checkOut;
        m.topic = returnedMeetUp.topic;

        let message = `${returnedMeetUp.student.name} er blevet tjekket `;
        isCheckIn ? message += "ind" : message += "ud"

        this.toastyService.success(message);
      })
      .catch(err => {
        let body = JSON.parse(err._body);
        this.toastyService.error(<ToastOptions>{
          title: "Der opstod en fejl",
          msg: body.message
        });
      })
  }

  public removeChecked(m: IMeetUp, isCheckIn: boolean) {
    const newMeetUp = <IMeetUp>{
      //checkIn: m.checkIn,
      //checkOut: m.checkOut,
      student: m.student,
      topic: m.topic
    }
    if (!isCheckIn) {
      newMeetUp.checkIn = m.checkIn;
    }

    this.lessonService.updateMeetUp(this.item.id, newMeetUp)
      .then(returnedMeetUp => {
        m.checkIn = returnedMeetUp.checkIn;
        m.checkOut = returnedMeetUp.checkOut;
        m.topic = returnedMeetUp.topic;

        let message;
        isCheckIn ? message = "ind" : message = "ind og ud"

        message = `Tjek ${message} for ${returnedMeetUp.student.name} er blevet fjernet`;
        this.toastyService.success(message);

      })
      .catch(err => {
        let body = JSON.parse(err._body);
        this.toastyService.error(<ToastOptions>{
          title: "Der opstod en fejl",
          msg: body.message
        });
      })
  }

  public onConfirmedDelete(event: any) {
    /*this.lessonService.deleteLesson(this.item.id)
      .then((deleted: boolean) => {
        this.detailsModal.hide();
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
      });*/
  }
}

