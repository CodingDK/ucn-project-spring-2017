namespace Models {
    export class MeetUpModel {

        checkIn: Date;
        checkOut: Date;
        topic: string;
        student: StudentModel; // student who met up

        constructor(checkIn: Date, topic: string, student: StudentModel) {
            this.checkIn = checkIn;
            this.topic = topic;
            this.student = student;
        }

        get getCheckIn() {
            return this.checkIn;
        }

        set setCheckIn(checkIn: Date) {
            this.checkIn = checkIn;
        }

        get getCheckOut() {
            return this.checkOut;
        }

        set setCheckOut(checkOut: Date) {
            this.checkOut = checkOut;
        }

        get getTopic() {
            return this.topic;
        }

        set setTopic(topic: string) {
            this.topic = topic;
        }

        get getStudent() {
            return this.student;
        }

        set setStudent(student: StudentModel) {
            this.student = student;
        }
    }
}