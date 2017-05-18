import { User } from './user';

export class MeetUp {

  checkIn: Date;
  checkOut: Date;
  topic: string;
  student: User; // student who met up

  constructor(student: User) {
    this.student = student;
  }

  static fromData(checkIn: Date, topic: string, student: User) {
    let meetUp = new MeetUp(student);
    meetUp.checkIn = checkIn;
    meetUp.topic = topic;
    return meetUp;
  }
}
