import { Teacher } from './teacher';
import { SchoolClass } from './schoolClass';
import { MeetUp } from './meetUp';

export class Lesson {
  id: string;
  startTime: Date;
  endTime: Date;
  teachers: Teacher[];
  schoolClass: SchoolClass;
  meetups: MeetUp[]; // students who met up

  constructor() { }

  static fromData(startTime: Date, teachers: Teacher[], schoolclass: SchoolClass): Lesson {
    let newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.teachers = teachers;
    newObj.schoolClass = schoolclass;
    return newObj;
  }

  static createNew(startTime: Date, endTime: Date, schoolClass: string, teachers: string[]) {
    let newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.endTime = endTime;
    newObj.schoolClass = new SchoolClass(schoolClass);
    newObj.teachers = teachers.map((value) => {
      let teacher = new Teacher();
      teacher.id = value;
      return teacher;
    })
    return newObj;
  }

  getTeachersAsStringArray(): string[] {
    return this.teachers.map((value) => {
      return value.id;
    });
  }
}