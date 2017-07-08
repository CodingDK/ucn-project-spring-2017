import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Roles } from "../../../../shared/constants/roles";

@Component({
  selector: 'lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent {
  constructor(private authService: AuthService) {}

  public isTeacher() {
    return this.authService.isUserInRole(Roles.teacher);
  }

  public isStudent() {
    return this.authService.isUserInRole(Roles.student);
  }
}
