namespace Models {
    export class StudentModel extends UserModel {
        schoolClass: SchoolClassModel;

        constructor(name: string, public uniLoginId: string, schoolClass: string) {
            super(name, uniLoginId);
            this.schoolClass = schoolClass;
        }

        get getSchoolClass() {
            return this.schoolClass;
        }
        set setSchoolClass(schoolClass: SchoolClassModel) {
            this.schoolClass = schoolClass;
        }
    }
}
