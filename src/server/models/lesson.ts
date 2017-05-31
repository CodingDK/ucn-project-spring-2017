import { SchoolClass } from './schoolClass';
import { MeetUp } from './meetUp';
import { User } from './user';
import { ILesson} from '../../shared/interfaces/iModels';

export class Lesson implements ILesson {
  id: string;
  startTime: Date;
  endTime: Date;
  teachers: User[];
  schoolClasses: SchoolClass[];
  meetUps: MeetUp[]; // students who met up

  static fromData(startTime: Date, teachers: User[], schoolClasses: SchoolClass[]): Lesson {
    const newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.teachers = teachers;
    newObj.schoolClasses = schoolClasses;
    return newObj;
  }

  static createNew(startTime: Date, endTime: Date, schoolClasses: string[], teachers: string[]) {
    const newObj = new Lesson();
    newObj.startTime = startTime;
    newObj.endTime = endTime;
    newObj.schoolClasses = schoolClasses.map(value => { return new SchoolClass(value); });
    newObj.teachers = teachers.map((value) => {
      const teacher = new User();
      teacher.id = value;
      return teacher;
    });
    return newObj;
  }

  constructor() {}
}
