import { ICreateLessonViewModel } from '../../../shared/interfaces/iCreateLessonViewModel';

export class CreateLessonViewModel implements ICreateLessonViewModel {
  startTime: Date;  
  endTime: Date;  
  teachers: string[];
  schoolClassNames: string[];
}