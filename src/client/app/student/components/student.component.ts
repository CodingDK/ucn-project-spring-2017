import { Injectable, Component } from '@angular/core';
import { CanActivate } from "@angular/router";

import { StudentService } from '../services/student.service';
import { IUser } from '../../../../shared/interfaces/iModels';


@Component({
    selector: 'student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']   
})

export class StudentComponent {
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