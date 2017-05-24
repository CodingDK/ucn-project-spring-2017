import { User } from './user';
import { IMeetUp } from '../../shared/interfaces/iModels';

export class MeetUp implements IMeetUp {

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
