import { Component } from '@angular/core';
import { LessonService } from "../../services/lesson.service";
import { ToastyService } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";
import { ILesson, IUser } from "../../../../../shared/interfaces/iModels";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'student-information',
    templateUrl: 'student-information.component.html',
    styleUrls: ['student-information.component.scss']
})

export class StudentInformationComponent {

}