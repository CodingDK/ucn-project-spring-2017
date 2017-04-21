import { User } from './user';
import { SchoolClass } from './schoolClass';

export class Student extends User {
   
   schoolClass: SchoolClass;

   constructor(name: string, public uniLoginId: string, schoolClass: SchoolClass) {
       super(name, uniLoginId);
       this.schoolClass = schoolClass;
    }
}

