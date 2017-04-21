import { Teacher } from './teacher';
import { SchoolClass } from './schoolClass';
import { MeetUp } from './meetUp';

export class Lesson {

    startTime: Date;
    endTime: Date;
    teacher: Teacher;
    schoolClass: SchoolClass;
    meetups: MeetUp[];         // students who met up

    constructor(startTime: Date, teacher: Teacher, schoolclass: SchoolClass) {
        this.startTime = startTime;
        this.teacher = teacher;
        this.schoolClass = schoolclass;
    }
}