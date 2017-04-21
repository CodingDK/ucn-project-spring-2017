import { Student } from './student';

export class MeetUp {

    checkIn: Date;
    checkOut: Date;
    topic: string;
    student: Student; // student who met up

    constructor(checkIn: Date, topic: string, student: Student) {
        this.checkIn = checkIn;
        this.topic = topic;
        this.student = student;
    } 
}
