import { ISchoolClass } from '../../shared/interfaces/iModels';

export class SchoolClass implements ISchoolClass {

    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

