import { Lesson } from '../models/lesson';
import { LessonDal } from '../dal/LessonDAL';

/**
 * Controller for handling Users
 */
export class LessonController {

    private dal: LessonDal = new LessonDal();

    /**
     * Method for creating a new lesson
     * @param startTime
     * @param teacher
     * @param schoolClass
     */
    public createLesson(startTime: Date, teacher: string, schoolClass: string): Promise<Lesson> {
        const newLesson = new Lesson();
        newLesson.startTime = startTime;
        newLesson.teacher = teacher;        // teacher should be object
        newLesson.schoolClass = schoolClass;

        return this.dal.createLesson(newLesson);
    }

    /**
     * Method for find a lesson by id
     * @param id
     */
    public findById(id: string): Promise<Lesson> {
        return this.dal.findById(id);
    }

    /**
     * Method for find a lesson by a date
     * @param lessonDate
     */
    public findBydate(lessonDate: Date): Promise<Lesson> {
        return this.dal.findByDate(lessonDate);
    }

    /**
     * Method for find a lesson by a daterange between two dates
     * @param lessonDates
     */
    public findByDateRange(lessonDates: Date[]): Promise<Lesson> {
        return this.dal.findByDateRange(lessonDates);
    }

    /**
     * Method for find a lesson by teacher
     * @param teacher
     */
    public findByTeacher(teacher: string): Promise<Lesson> {
        return this.dal.findByTeacher(teacher);
    }

    /**
     * Method for find a lesson by the school class
     * @param schoolClass
     */
    public findBySchoolClass(schoolClass: string): Promise<Lesson> {
        return this.dal.findBySchoolClass(schoolClass);
    }

    // public findByStartTime(): Promise<Lesson> {}
    // public findByEndTime(): Promise<Lesson> {}
}