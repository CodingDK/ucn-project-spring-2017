import { IBaseDAL } from './iBaseDAL';
import { Lesson } from '../../models/lesson';

export interface ILessonDAL extends IBaseDAL<Lesson> {
  getAll(user: any, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson[]>;

  findById(user: any, id: string, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson>;
}