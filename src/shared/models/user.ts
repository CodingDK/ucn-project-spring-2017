export class User {

    name: string;
    uniLoginId: string; // google login for now

    constructor(name: string, uniLoginId: string) {
        this.name = name;
        this.uniLoginId = uniLoginId;
    }       
}


