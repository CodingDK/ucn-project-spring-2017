import { validate, ValidationError } from "class-validator";

// models
import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { Student } from '../../shared/models/student';

// controllers
import { LessonController } from './LessonController';
import { BaseController } from './baseController';

/**
 * Controller for handling students' checkin / checkout from lesson
 */
export class StudentController extends BaseController {


    public studentCheckIn() {
        // TODO:
    }

    public studentCheckOut() {
        // TODO:
    }

    public setStudentTopic() {
        // TODO:
    }

    public getActiveLessons() {
        // TODO:
    }
}
