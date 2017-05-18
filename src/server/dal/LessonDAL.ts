import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { Student } from '../../shared/models/user';
import { CreateLessonViewModel } from '../viewmodels/createLessonViewModel';
import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';
import { Types } from 'mongoose';
import { validateObjectId } from './helpers';

import { ILessonDAL} from '../interfaces/dal/iLessonDAL';

/**
 * Class for handling Lessons in database
 */
export class LessonDAL implements ILessonDAL {

  public getAll(user: any): Promise<Lesson[]> {
    return new Promise<Lesson[]>((resolve: any, reject: any) => {
      Lessons.find({}).exec((err: any, objs: LessonDocument[]) => { //.populate('teachers') // .populate('meetUps.student')
        if (err) {
          return reject(DbError.makeNew(err, "A Database error happened"));
        }
        let retList = new Array<Lesson>();
        if (objs != null) {
          objs.forEach((value: LessonDocument) => {
            retList.push(this.getLessonObj(value));
          });
        }
        return resolve(retList);
      });
    });
  }


  /**
    * Method for find a lesson by the id
    * @param id the id to look for
    */
  public findById(user: any, id: string): Promise<Lesson> {
    return validateObjectId(id)
      .then((objectId: Types.ObjectId) => {
        return new Promise<Lesson>((resolve: any, reject: any) => {
          Lessons.findById(objectId, (err: any, lessonDoc: LessonDocument) => {
            if (err) {
              return reject(DbError.makeNew(err, "A Database error happened"));
            }
            if (lessonDoc != null) {
              return resolve(this.getLessonObj(lessonDoc));
            }
            return resolve(undefined);
          });
        });
      });
  }

  /**
   * Method for creating and inserting a new lesson
   * @param newLesson
   */
  public insert(user: any, newLesson: Lesson): Promise<Lesson> {
    return new Promise<DbLesson>(
      //First validate teachers Ids format and create dbLesson object
      (resolve: any, reject: any) => {
        const validateTeachersIdsPromises = newLesson.teachers.map((teacher) => { return validateObjectId(teacher.id) });
        let dbLesson = new DbLesson();

        return Promise.all(validateTeachersIdsPromises)
          .then((teachersObjectIds) => {
            dbLesson.teachers = teachersObjectIds;
            return resolve(dbLesson);
          });
      })
      //Next validate students Ids format and create meetups for students
      .then((dbLesson) => {
        const validateStudentIdsPromises = newLesson.meetups.map((meetUp) => { return validateObjectId(meetUp.student.id) });
        return Promise.all(validateStudentIdsPromises)
          .then((studentsObjectIds) => {
            dbLesson.meetUps = studentsObjectIds.map((value) => {
              let dbMeetUp = new DbMeetUp();
              dbMeetUp.student = value;
              return dbMeetUp;
            });
            return dbLesson;
          })
      })
      //Set the rest of the properties on dbLesson
      .then((dbLesson) => {
        dbLesson.startTime = newLesson.startTime;
        dbLesson.endTime = newLesson.endTime;
        dbLesson.schoolClasses = newLesson.schoolClasses.map(value => { return value.name});

        return dbLesson;
      })
      //Send dbLesson to database
      .then((dbLesson: DbLesson) => {
        return Lessons.create(dbLesson).catch((err: any) => {
          throw DbError.makeNew(err, `Error happened in creating a new lesson in database`);
        });
      })
      //Convert a db document to a lesson object
      .then((createdLesson: LessonDocument) => {
        return this.getLessonObj(createdLesson);
      })
      .catch((err: any) => {
        let retError = err;
        if (!(err instanceof DbError)) {
          retError = DbError.makeNew(err, `Error happened in creating a new lesson in Dal layer`);
        }
        throw retError;
      });
  }

  /**
   * Delete a lesson from the database by id
   * @param id the id to delete from database
   */
  public deleteById(user: any, id: string): Promise<boolean> {
    return validateObjectId(id)
      .then((objectId: Types.ObjectId) => {
        return new Promise<boolean>((resolve, reject) => {
          Lessons.findByIdAndRemove(objectId, (err: any, lessonDoc: LessonDocument) => {
            if (err) {
              return reject(DbError.makeNew(err, `Database error happened in deleting id: ${id}`));
            }
            let deleted = typeof lessonDoc !== "undefined" && lessonDoc != null;
            return resolve(deleted);
          });
        });
      });
  }

  public update(user: any, lesson: Lesson): Promise<Lesson> {
    throw new Error("lessonDAl update not implemented yet");
  }

  /**
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

  /**
   * Method for make MeetUp object to DbMeetUp object
   */
  private getMeetUpsAsDbObjects(meetups: MeetUp[]): DbMeetUp[] {
    return meetups.map((value) => {
      let newDbMeetUp = new DbMeetUp();
      newDbMeetUp.checkIn = value.checkIn;
      newDbMeetUp.checkOut = value.checkOut;
      newDbMeetUp.topic = value.topic;
      newDbMeetUp.student = Types.ObjectId((<Student>value.student).id);
      return newDbMeetUp;
    })
  }

}