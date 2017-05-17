// models
import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { Student } from '../../shared/models/user';

import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';
import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';
import { Types } from 'mongoose';
import { validateObjectId } from './helpers';

// Data Access Layer
import { LessonDal } from './LessonDAL';
import { UserDal } from './UserDAL';

export class StudentDal {

    public studentCheckIn(): Promise<any> {
        // TODO:
    }

    public studentCheckOut(): Promise<any> {
        // TODO:
    }

    public setStudentTopic(): Promise<any> {
        // TODO:
    }

    public getActiveLessons(): Promise<any> {
        // TODO:
    }

}