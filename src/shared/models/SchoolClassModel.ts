namespace Models {
    export class SchoolClassModel {
        name: string;

        constructor(name: string) {
            this.name = name;
        }

        get getName() {
            return this.name;
        }
        set setName(name: string) {
            this.name = name;
        }
    }
}
