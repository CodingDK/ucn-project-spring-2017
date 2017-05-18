export interface ICreateLessonViewModel {
  id?: string;
  startTime: Date;
  endTime: Date;
  teachers: string[];
  schoolClassNames: string[];
  meetUpStudents: string[];
}