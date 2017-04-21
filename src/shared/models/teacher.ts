import { User } from './user';
import { SchoolClass } from './schoolClass';

export class Teacher extends User {

    roles: string[];
    schoolClasses: SchoolClass[];

    constructor(name: string, public uniLoginId: string, roles: string[], schoolClasses: SchoolClass[]) {
        super(name, uniLoginId);
        this.roles = roles;
        this.schoolClasses = schoolClasses;
    }        
}
