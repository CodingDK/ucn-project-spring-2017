import { Component } from '@angular/core';
import { LessonService } from "../../services/lesson.service";
import { ToastyService } from "ng2-toasty";
import { ActivatedRoute, Router } from "@angular/router";
import { ILesson, IUser } from "../../../../../shared/interfaces/iModels";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'lesson-student',
    templateUrl: 'lesson-student.component.html',
    styleUrls: ['lesson-student.component.scss']
})
export class LessonStudentComponent {

    studentCheckedIn: boolean;
    activateLessons: boolean;

    // mock variables
    teachers: string[];
    startTime: string;
    endTime: string;

    studentName: string;
    className: string;
    studentTopic: string; 

    constructor() {
        this.studentCheckedIn = false;
        this.activateLessons = this.getActiveLessons();

        // set up mock data
        this.teachers = ["Ditte", "Hans"];
        this.startTime = "13:00";
        this.endTime = "15:00";

        this.studentName = "Anne Larsen";
        this.className = "klasse1";
        this.studentTopic = "";
    }

    public studentCheckIn(): void {
        // TODO: proper backend function call

        this.studentCheckedIn = true;
        console.log('student Checked in');
    }

    public studentCheckOut(): void {
        // TODO: proper backend function call

        this.studentCheckedIn = false;
        console.log('student Checked out');
    }

    public getActiveLessons(): boolean {
        // TODO: proper check from backend
        return true;
    }

    public setStudentTopic(topic: string): void {
        //this.studentTopic = topic;
        console.log('Change topic');
    }
}