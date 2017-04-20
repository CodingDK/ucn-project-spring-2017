import { Lesson } from './models/dbLesson';
import { DbLesson, LessonDocument, Lessons } from './models/dbLesson';

/**
 * Class for handling Lessons in database
 */
export class LessonDal {

   /**
    * Method for creating a new lesson
    * @param newLesson
    */
    public createLesson(newLesson: Lesson): Promise<Lesson> {
        return new Promise<Lesson>((resolve, reject) => {
            Lessons.create(newLesson, (err: any, createdLesson: LessonDocument) => {
                if (err) {
                    reject(err);
                }
                if (createdLesson != null) {
                    resolve(createdLesson.toObject() as Lesson);
                }
                resolve(undefined);
            })
        });
    }

    /**
     * Method for find a lesson by the id
     * @param id
     */
    public findById(id: string): Promise<Lesson> {
        return new Promise<Lesson>((resolve, reject) => {
            Lessons.findById(id, (err, lessonDoc: LessonDocument) => {
                if (err) {
                    //TODO maybe better error handling
                    reject(err);
                    //throw new DbError(JSON.stringify(err));
                }
                if (lessonDoc != null) {
                    resolve(lessonDoc.toObject() as Lesson);
                }
                resolve(undefined);
            });
        });
    }

    /**
     * 
     * @param lessonDate
     */
    public findByDate(lessonDate: Date): Promise<Lesson> {
        // TODO: 
        return null;
    }

    /**
     * 
     * @param lessonDates
     */
    public findByDateRange(lessonDates: Date[]): Promise<Lesson> {
        // TODO: 
    }

    /**
     * 
     * @param teacher
     */
    public findByTeacher(teacher: string): Promise<Lesson> {
        // TODO: 
    }

    /**
     * 
     * @param schoolClass
     */
    public findBySchoolClass(schoolClass: string): Promise<Lesson> {
        // TODO:
    }

    /**
     * 
     * @param startTime
     */
    private findByStartTime(startTime: Date): Promise<Lesson> {
        return null;
    }

    /**
     * 
     * @param endTime
     */
    private findByEndTime(endTime: Date): Promise<Lesson> {
        return null;
    }
    
    
}