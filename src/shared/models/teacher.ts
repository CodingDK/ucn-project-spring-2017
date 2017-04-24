import { User } from './user';
import { SchoolClass } from './schoolClass';

export class Teacher extends User {
  roles: string[];
  schoolClasses: SchoolClass[];

  constructor() {
    super();
  }

  static fromData(name: string, uniLoginId: string, roles: string[], schoolClasses: SchoolClass[]) {
    let newObj = new Teacher();
    super.setFromData(newObj, name, uniLoginId);
    newObj.roles = roles;
    newObj.schoolClasses = schoolClasses;
    return newObj;
  }
}
