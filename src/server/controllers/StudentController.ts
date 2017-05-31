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
 * Controller for handling students' checkin / checkout from lesson and change of topic for student's meetup
 */
export class StudentController extends BaseController {
    private dal: StudentDal = new StudentDal();

    /**
     * Checkout for student in a specific lesson
     * @param user
     * @param lessonId
     * @param studentId
     */
    public studentCheckIn(user: any, lessonId: string, studentId: string): Promise<any>
    {
        return this.dal.studentCheckIn(user, lessonId, studentId)
            .catch(this.errorHandler.bind(this));
    }

    /**
     * Checkin for student in a specific lesson
     * @param user
     * @param lessonId
     * @param studentId
     */
    public studentCheckOut(user: any, lessonId: string, studentId: string): Promise<any> {
        return this.dal.studentCheckIn(user, lessonId, studentId)
            .catch(this.errorHandler.bind(this));
    }

    /**
     * Set topic for student in a specific lesson
     * @param user
     * @param lessonId
     * @param studentId
     * @param topic
     */
    public setStudentTopic(user: any, lessonId: string, studentId: string, topic: string): Promise<any> {
        return this.dal.setStudentTopic(user, lessonId, studentId, topic)
            .catch(this.errorHandler.bind(this));
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
