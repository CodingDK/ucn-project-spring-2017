// models
import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { User } from '../models/user';

import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';
import { Types } from 'mongoose';
import { validateObjectId } from './helpers';

// Data Access Layer
import { LessonDAL } from './LessonDAL';
import { UserDAL } from './UserDAL';

export class StudentDal {

    public studentCheckIn(): void //Promise<any>
    {
        // TODO:
    }

    public studentCheckOut(): void //Promise<Lesson[]>
    {
        // TODO:
    }

    public setStudentTopic(): void //Promise<Lesson[]>
    {
        // TODO:
    }

    public getActiveLessons(): void //Promise<Lesson[]>
    {
        // get current time and date
        var currentTime = new Date().toLocaleTimeString();
        var currentDate = new Date().toLocaleDateString();
        console.log(currentTime);
        console.log(currentDate);


        //Lessons.find({}).exec(err: any, objs: LessonDocument[]) => {
        //    if (err) {
        //        return reject(DbError.makeNew(err, "A Database error happened"));
        //    }

        //    let foundLessons = new Array<Lesson>();

        //    if (objs != null) {

        //    }

        //}
        
        
          
        }
    

    //public getAll(user: any): Promise<Lesson[]> {
    //    return new Promise<Lesson[]>((resolve: any, reject: any) => {
    //        Lessons.find({}).exec((err: any, objs: LessonDocument[]) => { //.populate('teachers') // .populate('meetUps.student')
    //            if (err) {
    //                return reject(DbError.makeNew(err, "A Database error happened"));
    //            }
    //            let retList = new Array<Lesson>();
    //            if (objs != null) {
    //                objs.forEach((value: LessonDocument) => {
    //                    retList.push(this.getLessonObj(value));
    //                });
    //            }
    //            return resolve(retList);
    //        });
    //    });
    //}

}