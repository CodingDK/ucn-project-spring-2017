import { Injectable, Component } from '@angular/core';
import { CanActivate } from "@angular/router";

import { StudentService } from '../services/student.service';
//import { AuthService } from '../../services/auth.service';
import { Lesson } from '../models/lesson';

import { StudentLessonComponent } from './studentLesson.component';

@Component({
    selector: 'student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']   
})

export class StudentComponent {
    studentCheckedIn: boolean; 
    activateLessons: boolean;

    constructor() {
        this.studentCheckedIn = false;
        this.activateLessons = false;
    }

    public studentCheckIn(): void {
        this.studentCheckedIn = true;
        console.log('student Checked in');
    }

    public studentCheckOut(): void {
        this.studentCheckedIn = false;
        console.log('student Checked out');
    }
}