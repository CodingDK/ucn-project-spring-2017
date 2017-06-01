import { IBaseDAL } from './iBaseDAL';
import { Lesson } from '../../models/lesson';
import { IMeetUp, IUser } from '../../../shared/interfaces/iModels';

export interface IStudentDAL extends IBaseDAL<Lesson> {

    studentCheckIn(user: IUser, lessonId: string, studentId: string): Promise<any>;

    studentCheckOut(user: IUser, lessonId: string, studentId: string): Promise<any>;

    setStudentTopic(user: IUser, lessonId: string, studentId: string, topic: string): Promise<any>;

    getActiveLessons(): Promise<Lesson[]>;
}