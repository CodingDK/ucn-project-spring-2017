import * as moment from 'moment';

// models
import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { User } from '../models/user';

import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';
import { Types, DocumentQuery } from 'mongoose';
import { validateObjectId } from './helpers';

// Data Access Layer
import { LessonDAL } from './LessonDAL';
import { UserDAL } from './UserDAL';

export class StudentDal {

    public studentCheckIn(user: any, id: string): Promise<Lesson>
    {          

        return validateObjectId(id)
            .catch((err: any) => {
                return null;
            })
            .then((objectId: Types.ObjectId) => {
                return new Promise<Lesson>((resolve: any, reject: any) => {
                    this.getPopulated(Lessons.findById(objectId), true, true)
                        .exec((err: any, lessonDoc: LessonDocument) => {
                            if (err) {
                                return reject(DbError.makeNew(err, "A Database error happened"));
                            }
                            if (lessonDoc != null) {
                                console.log(lessonDoc);
                                return resolve(this.getLessonObj(lessonDoc));
                            }
                            return resolve(undefined);
                        });                    
                });

            });
    }

    public studentCheckOut(): void //Promise<Lesson[]>
    {
        // TODO:
    }

    public setStudentTopic(): void //Promise<Lesson[]>
    {
        // TODO:
    }

    private getPopulated<T>(query: DocumentQuery<T, LessonDocument>, populateTeacher?: boolean, populateStudent?: boolean): DocumentQuery<T, LessonDocument> {

        query = populateTeacher ? query.populate('teachers', 'name imageUrl') : query;
        query = populateStudent ? query.populate('meetUps.student', 'name imageUrl') : query
        return query;
    }

    public getActiveLessons(): Promise<Lesson[]> { 
        return new Promise<Lesson[]>((resolve: any, reject: any) => {                  

            Lessons.find({
                'startTime': { '$lte': moment().toDate()  },
                'endTime': { '$gte': moment().toDate()   }                

            }).exec((err: any, objs: LessonDocument[]) => {

                if (err) {
                    return reject(DbError.makeNew(err, "A Database error happened"));
                }

                let retList = new Array<Lesson>();

                if (objs != null) {
                    objs.forEach((value: LessonDocument) => {
                        retList.push(this.getLessonObj(value));
                    })
                }

                console.log(retList);

                return resolve(retList);
            })         
        })
    }
   

    /**
    TODO: Delete when moved to main lesson dal class
   * Make a Lesson object from a DbLesson object
   * @param dbLesson - the dbLesson object to convert
   */
    private getLessonObj(dbLesson: LessonDocument): Lesson {
        let lesson = dbLesson.toObject() as any;
        //check and set objectIds to strings for teachers
        const firstTeacher = lesson.teachers[0];
        if (firstTeacher && firstTeacher instanceof Types.ObjectId) {
            lesson.teachers = lesson.teachers.map((value: Types.ObjectId) => {
                return value.toString();
            })
        }
        //check and set objectIds to strings for student
        const firstMeetUp = lesson.meetUps[0];
        if (firstMeetUp && firstMeetUp.student && firstMeetUp.student instanceof Types.ObjectId) {
            lesson.meetUps = lesson.meetUps.map((value: any) => {
                value.student = value.student.toString();
                return value;
            });
        }

        return lesson;
    }

}