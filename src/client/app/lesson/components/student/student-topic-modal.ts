import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';

import { LessonService } from '../../services/lesson.service';
import { LessonConfirmModalComponent } from '../shared/lesson-confirm-modal.component';
import { ILesson, IMeetUp } from '../../../../../shared/interfaces/iModels';


@Component({
    selector: 'student-topic-modal',
    templateUrl: './student-topic-modal.component.html',
    styleUrls: ['./student-topic-modal.component.scss']
})
export class StudentTopicModalComponent implements OnInit {
    @ViewChild('topicModal')
    topicModal: ModalDirective;

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
        this.topicModal.hide();
    }

    public onHidden(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    public changeTopic() { }


}
