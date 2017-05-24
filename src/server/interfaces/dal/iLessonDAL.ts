import { IBaseDAL } from './iBaseDAL';
import { Lesson } from '../../models/lesson';
import { IMeetUp } from '../../../shared/interfaces/iModels';

export interface ILessonDAL extends IBaseDAL<Lesson> {
  getAll(user: any, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson[]>;

  findById(user: any, id: string, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson>;

  updateMeetUp(user: any, lessonId: string, studentId: string, meetUp: IMeetUp): Promise<IMeetUp>;
}