namespace Models {
    export class TeacherModel extends UserModel {
        roles: string[];
        schoolClasses: SchoolClassModel[];

        constructor(name: string, public uniLoginId: string, roles: string[], schoolClasses: SchoolClassModel[]) {
            super(name, uniLoginId);
            this.roles = roles;
            this.schoolClasses = schoolClasses;
        }

        get getRoles() {
            return this.roles;
        }

        set setRoles(roles: string[]) {
            this.roles = roles;
        }

        get getSchoolClasses() {
            return this.schoolClasses;
        }
        set setSchoolClasses(SchoolClasses: SchoolClassModel[]) {
            this.schoolClasses = SchoolClasses;
        }
    }
}