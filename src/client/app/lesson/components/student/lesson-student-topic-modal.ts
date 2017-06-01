import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';

import { LessonService } from '../../services/lesson.service';
import { LessonConfirmModalComponent } from '../shared/lesson-confirm-modal.component';
import { ILesson, IMeetUp } from '../../../../../shared/interfaces/iModels';


@Component({
  selector: 'lesson-student-topic-modal',
  templateUrl: './lesson-student-topic-modal.component.html',
  styleUrls: ['./lesson-student-topic-modal.component.scss']
})
export class LessonStudentTopicModalComponent implements OnInit {
  @ViewChild('topicModal') topicModal: ModalDirective;
  @Output() onConfirmed = new EventEmitter<string>();

  topic: string;
  isModalShown = false;
  item: ILesson;

  constructor(private lessonService: LessonService, private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {

  }

  public showModal(topic: string): void {
    this.topic = topic;
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.topicModal.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }

  public submit() {
    this.onConfirmed.emit(this.topic);
  }
}
