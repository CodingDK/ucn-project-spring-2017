import { IBaseDAL } from './iBaseDAL';
import { Lesson } from '../../models/lesson';
import { IMeetUp, IUser } from '../../../shared/interfaces/iModels';

export interface ILessonDAL extends IBaseDAL<Lesson> {
  getAll(user: IUser, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson[]>;

  findById(user: IUser, id: string, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson>;

  updateMeetUp(user: IUser, lessonId: string, studentId: string, meetUp: IMeetUp): Promise<IMeetUp>;
}
