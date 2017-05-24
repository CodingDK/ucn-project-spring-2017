export interface ILesson {
  id: string;
  startTime: Date;
  endTime: Date;
  teachers: IUser[];
  schoolClasses: ISchoolClass[];
  meetUps: IMeetUp[];
}

export interface IUser {
  id: string;
  name: string;
  googleId: string;
  imageUrl: string;
  roles: string[];
  schoolClasses: ISchoolClass[];
}

export interface ISchoolClass {
  name: string;
}

export interface IMeetUp {
  checkIn: Date;
  checkOut: Date;
  topic: string;
  student: IUser;
}