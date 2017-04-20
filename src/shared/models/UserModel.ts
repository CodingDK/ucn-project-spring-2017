namespace Models {
    export class UserModel {
        name: string;
        uniLoginId: string; // google login for now

        constructor(name: string, uniLoginId: string) {
            this.name = name;
            this.uniLoginId = uniLoginId;
        }

        get getName() {
            return this.name;
        }
        set setName(userName: string) {
            this.name = userName;
        }

        get getUniLoginId() {
            return this.uniLoginId;
        }

        set setUniLoginId(uniLoginId: string) {
            this.uniLoginId = uniLoginId;
        } 
    }
}

