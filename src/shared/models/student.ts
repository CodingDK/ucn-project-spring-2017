import { User } from './user';
import { SchoolClass } from './schoolClass';

export class Student extends User {

  schoolClass: SchoolClass;

  constructor() {
    super();
  }

  static fromData(name: string, uniLoginId: string, schoolClass: SchoolClass): Student {
    let student = new Student();
    super.setFromData(student, name, uniLoginId);
    student.schoolClass = schoolClass;
    return student;
  }
}

