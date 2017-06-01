import { Component, OnInit, ViewChild } from '@angular/core';
import { LessonService } from "../../services/lesson.service";
import { ToastyService, ToastOptions } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";
import { ILesson, IUser, ISchoolClass, IMeetUp } from "../../../../../shared/interfaces/iModels";
import { AuthService } from "../../../services/auth.service";
import { LessonStudentTopicModalComponent } from "./lesson-student-topic-modal";


@Component({
  selector: 'lesson-student',
  templateUrl: 'lesson-student.component.html',
  styleUrls: ['lesson-student.component.scss']
})
export class LessonStudentComponent implements OnInit {
  @ViewChild(LessonStudentTopicModalComponent)
  topicModal: LessonStudentTopicModalComponent;

  item: ILesson;

  constructor(
    private lessonService: LessonService,
    private authService: AuthService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.item = this.lessonService.getAllLessons()[0];
  }

  hasActiveLesson(): boolean {
    return this.item !== undefined;
  }

  getMeetUp() {
    return this.item.meetUps[0];
  }

  getCheckIn() {
    return this.getMeetUp().checkIn;
  }

  getCheckOut() {
    return this.getMeetUp().checkOut;
  }

  openEditTopic() {
    this.topicModal.showModal(this.getMeetUp().topic);
  }

  submitNewTopic(newTopic: string | undefined) {
    const m = this.getMeetUpCopy();
    const oldTopic = m.topic;
    newTopic = newTopic && newTopic.length > 0 ? newTopic : undefined;

    if (newTopic !== m.topic) { //
      m.topic = <string>newTopic;
      this.updateMeetUp(m, "Dit emne er blevet opdateret", () => { 
        this.topicModal.hideModal();
      });
    } else {
      this.topicModal.hideModal();
    }
  }

  clickedCheckBtn(isCheckIn: boolean) {
    const m = this.getMeetUpCopy();
    if (isCheckIn) {
      m.checkIn = new Date();
    } else {
      m.checkOut = new Date();
    }
    let message = `Du er blevet tjekket `;
    isCheckIn ? message += "ind" : message += "ud";
    this.updateMeetUp(m, message);
  }

  private getMeetUpCopy() {
    const m = this.getMeetUp();
    return <IMeetUp>{
      checkIn: m.checkIn,
      checkOut: m.checkOut,
      student: m.student,
      topic: m.topic
    };
  }

  public updateMeetUp(newMeetUp: IMeetUp, message: string, action?: () => void) {
    const m = this.getMeetUp();
    let promise = this.lessonService.updateMeetUp(this.item.id, newMeetUp)
      .then(returnedMeetUp => {
        m.checkIn = returnedMeetUp.checkIn;
        m.checkOut = returnedMeetUp.checkOut;
        m.topic = returnedMeetUp.topic;
        this.toastyService.success(message);
      });
      if (action !== undefined) {
        promise = promise.then(action);
      }
    return promise.catch(err => {
        const body = JSON.parse(err._body);
        this.toastyService.error(<ToastOptions>{
          title: "Der opstod en fejl",
          msg: body.message
        });
      });
  }

}
