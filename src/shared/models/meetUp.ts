import { Student } from './student';

export class MeetUp {

  checkIn: Date;
  checkOut: Date;
  topic: string;
  student: Student; // student who met up

  constructor(student: Student) {
    this.student = student;
  }

  static fromData(checkIn: Date, topic: string, student: Student) {
    let meetUp = new MeetUp(student);
    meetUp.checkIn = checkIn;
    meetUp.topic = topic;
    return meetUp;
  }
}
