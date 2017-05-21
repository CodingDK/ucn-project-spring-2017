import { validate, ValidationError } from "class-validator";

// models
import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { User } from '../models/user';

// controllers
import { LessonController } from './LessonController';
import { BaseController } from './baseController';

// Data Access Layer
import { StudentDal } from '../dal/StudentDAL';

/**
 * Controller for handling students' checkin / checkout from lesson
 */
export class StudentController extends BaseController {
    private dal: StudentDal = new StudentDal();

    public studentCheckIn(user: any, id: string): Promise<boolean> {
        return this.dal.studentCheckIn(user, id)
            .catch(this.errorHandler.bind(this));
    }

    public studentCheckOut() {
        // TODO:
    }

    public setStudentTopic() {
        // TODO:
    }

    /**
     * Get all active lessons
     * @param user
     */
    public getActiveLessons(user: any): Promise<Lesson[]> {        
        return this.dal.getActiveLessons()
        .catch(this.errorHandler.bind(this));
    }
}
