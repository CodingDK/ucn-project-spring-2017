import { SchoolClass } from './schoolClass';
import { MeetUp } from './meetUp';
import { User } from './user';

export class Lesson {
  id: string;
  startTime: Date;
  endTime: Date;
  teachers: User[];
  schoolClasses: SchoolClass[];
  meetups: MeetUp[]; // students who met up

  constructor() { }

  static fromData(startTime: Date, teachers: User[], schoolClasses: SchoolClass[]): Lesson {
    let newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.teachers = teachers;
    newObj.schoolClasses = schoolClasses;
    return newObj;
  }

  static createNew(startTime: Date, endTime: Date, schoolClasses: string[], teachers: string[]) {
    let newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.endTime = endTime;
    newObj.schoolClasses = schoolClasses.map(value => { return new SchoolClass(value) });
    newObj.teachers = teachers.map((value) => {
      let teacher = new User();
      teacher.id = value;
      return teacher;
    })
    return newObj;
  }
}