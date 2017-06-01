import { Component } from '@angular/core';
import { LessonService } from "../../services/lesson.service";
import { ToastyService } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";
import { ILesson, IUser, ISchoolClass, IMeetUp } from "../../../../../shared/interfaces/iModels";
import { AuthService } from "../../../services/auth.service";


@Component({
    selector: 'lesson-student',
    templateUrl: 'lesson-student.component.html',
    styleUrls: ['lesson-student.component.scss']
})
export class LessonStudentComponent {
    isCheckedIn: boolean;

    lessonId: string;
    studentName: string;
    schoolClasses: ISchoolClass[];
    lessonStartTime: Date;
    lessonEndTime: Date;
    studentTopic: string;
    teachers: IUser[];

    constructor(private lessonService: LessonService,
        private authService: AuthService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router) {
        this.lessonService.refreshAllLessons();

        this.isCheckedIn = false;
        this.lessonId = "";
        this.studentName = "";
        this.lessonStartTime = new Date();
        this.lessonEndTime = new Date();
        this.studentTopic = "";
        
        
    }

    //getActiveLessons(): Promise<ILesson> {
    //    let allActiveLessons = this.lessonService.getActiveLessons();
    //    const user = this.authService.getUser();

    //    if (user != null && user.roles.indexOf("admin") != -1) {
    //        allLessons = allLessons.filter(lesson => lesson.teachers.findIndex(teacher => teacher.id == user.id) != -1);
    //    }
    //    return allActiveLessons;
    //}

    checkIn(lesson: ILesson) {
        console.log('checkin');
        this.isCheckedIn = true;
        console.log(lesson.id);

        lesson.startTime

        this.lessonId = lesson.id;
        this.lessonStartTime = lesson.startTime;
        this.lessonEndTime = lesson.endTime;

        const user = this.authService.getUser();
        this.studentName = user.name;

        this.schoolClasses = user.schoolClasses;
        this.teachers = lesson.teachers;
    }

    checkOut() {
        console.log('checkOut');
        this.isCheckedIn = false;
    }

    setTopic(lesson: ILesson) {
        this.openTopicsModal(lesson);        
    }

    getAll(): ILesson[] {
        let allLessons = this.lessonService.getAllLessons();
    const user = this.authService.getUser();
    if (user != null && user.roles.indexOf("admin") != -1) {
      allLessons = allLessons.filter(lesson => lesson.teachers.findIndex(teacher => teacher.id == user.id) != -1);
    }
    return allLessons;
    }

    openTopicsModal(lesson: ILesson) {
        this.router.navigate(['topic', lesson], { relativeTo: this.route });
    }

    //getAll(): ILesson[] {
    //    let allLessons = this.lessonService.getAllLessons();
    //    const user = this.authService.getUser();
    //    if (user != null && user.roles.indexOf("admin") != -1) {
    //        allLessons = allLessons.filter(lesson => lesson.teachers.findIndex(teacher => teacher.id == user.id) != -1);
    //    }
    //    return allLessons;
    //}
    
}