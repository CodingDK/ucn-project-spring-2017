import { ICreateLessonViewModel } from '../../../shared/interfaces/iCreateLessonViewModel';

export class CreateLessonViewModel implements ICreateLessonViewModel {
  id?: string
  startTime: Date;  
  endTime: Date;  
  teachers: string[];
  schoolClassNames: string[];

  meetUpStudents: string[];
}