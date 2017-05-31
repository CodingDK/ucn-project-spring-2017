import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { SchoolClass } from '../models/schoolClass';
import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';
import { Types, DocumentQuery } from 'mongoose';
import { validateObjectId } from './helpers';

import { IMeetUp, IUser } from '../../shared/interfaces/iModels';

import { ILessonDAL } from '../interfaces/dal/iLessonDAL';

/**
 * Class for handling Lessons in database
 */
export class LessonDAL implements ILessonDAL {

  public getAll(user: IUser, populateTeacher: boolean, populateStudent: boolean): Promise<Lesson[]> {
    const queryAndProjection = this.getQueryAndProjection(user);

    return new Promise<Lesson[]>((resolve: any, reject: any) => {
      this.getPopulated(Lessons.find(queryAndProjection.query, queryAndProjection.projection), populateTeacher, populateStudent)
        .exec((err: any, objs: LessonDocument[]) => {
          if (err) {
            return reject(DbError.makeNew(err, "A Database error happened"));
          }
          const retList = new Array<Lesson>();
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
  public findById(user: IUser, id: string, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson> {
    return validateObjectId(id)
      .catch((err: any) => {
        return null;
      })
      .then((objectId: Types.ObjectId) => {
        const queryAndProjection = this.getQueryAndProjection(user, { _id: objectId});

        return new Promise<Lesson>((resolve: any, reject: any) => {
          this.getPopulated(Lessons.findOne(queryAndProjection.query, queryAndProjection.projection), populateTeacher, populateStudent)
            .exec((err: any, lessonDoc: LessonDocument) => {
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

  private getQueryAndProjection(user: IUser, query: any = {}, projection: any = {}) {
    if (user != null) {
      if (user.roles.indexOf("student") !== -1) {
        query = Object.assign(query, this.getStudentQuery(user.id));
        projection = Object.assign(projection, this.getStudentProjection(user.id));
      } else if (user.roles.indexOf("admin") === -1 && user.roles.indexOf("teacher") !== -1) {
        query = Object.assign(query, { teachers: Types.ObjectId(user.id)});
      }
    }
    return {
      query,
      projection
    };
  }

  private getStudentQuery(userId: string) {
    return { "meetUps.student": Types.ObjectId(userId) };
  }

  private getStudentProjection(userId: string) {
    return {
      _id: 1,
      teachers: 1,
      startTime: 1,
      endTime: 1,
      schoolClasses: 1,
      meetUps: {
        $elemMatch: {
          student: Types.ObjectId(userId)
        }
      }
    };
  }

  private getPopulated<T>(query: DocumentQuery<T, LessonDocument>,
    populateTeacher?: boolean, populateStudent?: boolean): DocumentQuery<T, LessonDocument> {

    query = populateTeacher ? query.populate('teachers', 'name imageUrl') : query;
    query = populateStudent ? query.populate('meetUps.student', 'name imageUrl') : query;
    return query;
  }

  /**
   * Method for creating and inserting a new lesson
   * @param newLesson the lesson to insert
   */
  public insert(user: IUser, newLesson: Lesson): Promise<Lesson> {
    //First validate teachers Ids format and create dbLesson object
    return this.validateTeachersIdsAndCreateDbLesson(newLesson)
      //Next validate students Ids format and create meetups for students
      .then((dbLesson) => {
        return this.validateStudentsIdsAndCreateDbMeetUps(newLesson).then(meetUps => {
          dbLesson.meetUps = meetUps;
          return dbLesson;
        });
      })
      //Set the rest of the properties on dbLesson
      .then((dbLesson) => {
        dbLesson.startTime = newLesson.startTime;
        dbLesson.endTime = newLesson.endTime;
        dbLesson.schoolClasses = newLesson.schoolClasses.map(value => { return value.name; });

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
   * Method for updating a lesson
   * @param newLesson to update with the new values
   */
  public update(user: IUser, newLesson: Lesson): Promise<Lesson> {
    //First validate teachers Ids format and create dbLesson object
    return this.validateTeachersIdsAndCreateDbLesson(newLesson)
      //Next validate students Ids format and create meetups for students
      .then((dbLesson) => {
        return this.validateStudentsIdsAndCreateDbMeetUps(newLesson).then(meetUps => {
          dbLesson.meetUps = meetUps;
          return dbLesson;
        });
      })
      //Set the rest of the properties on dbLesson
      .then((dbLesson) => {
        dbLesson.startTime = newLesson.startTime;
        dbLesson.endTime = newLesson.endTime;
        dbLesson.schoolClasses = newLesson.schoolClasses.map(value => { return value.name; });

        return dbLesson;
      })
      //Send dbLesson to database
      .then((dbLesson: DbLesson) => {
        return new Promise<LessonDocument>((resolve: any, reject: any) => {
          const setQuery = {
            $set: <LessonDocument>{
              startTime: dbLesson.startTime,
              endTime: dbLesson.endTime,
              teachers: dbLesson.teachers,
              schoolClasses: dbLesson.schoolClasses,
              meetUps: dbLesson.meetUps
            }
          };
          Lessons.findByIdAndUpdate(newLesson.id, setQuery)
            .exec((err: any, updatedLesson: LessonDocument) => {
              if (err) {
                return reject(DbError.makeNew(err, `Database error happened in updating id: ${newLesson.id}`));
              }
              //console.log("updatedLesson", updatedLesson);
              if (!updatedLesson) {
                return reject(DbError.makeNew(err, `The id '${newLesson.id}' does not exist in the database`, 404));
              }
              return resolve(updatedLesson);
            });
        });
      })
      //Convert a db document to a lesson object
      .then((createdLesson: LessonDocument) => {
        return this.getLessonObj(createdLesson);
      })
      .catch((err: any) => {
        let retError = err;
        console.log("lessonDal hvilken fejl?", retError);
        if (!(err instanceof DbError)) {
          retError = DbError.makeNew(err, `Error happened in updating a lesson in Dal layer`);
        }
        console.log("lessonDal hvilken fejl?", retError);
        throw retError;
      });
  }

  private validateTeachersIdsAndCreateDbLesson(lesson: Lesson): Promise<DbLesson> {
    return new Promise<DbLesson>(
      //First validate teachers Ids format and create dbLesson object
      (resolve: any, reject: any) => {
        const validateTeachersIdsPromises = lesson.teachers.map((teacher) => { return validateObjectId(teacher.id); });
        const dbLesson = new DbLesson();

        return Promise.all(validateTeachersIdsPromises)
          .then((teachersObjectIds) => {
            dbLesson.teachers = teachersObjectIds;
            return resolve(dbLesson);
          });
      });
  }

  private validateStudentsIdsAndCreateDbMeetUps(lesson: Lesson): Promise<DbMeetUp[]> {
    const validateStudentIdsPromises = lesson.meetUps.map((meetUp) => { return validateObjectId(meetUp.student.id); });
    return Promise.all(validateStudentIdsPromises)
      .then((studentsObjectIds) => {
        return studentsObjectIds.map((value) => {
          const dbMeetUp = new DbMeetUp();
          dbMeetUp.student = value;
          return dbMeetUp;
        });
      });
  }

  /**
   * Delete a lesson from the database by id
   * @param id the id to delete from database
   */
  public deleteById(user: IUser, id: string): Promise<boolean> {
    return validateObjectId(id)
      .catch((err: any) => {
        return null;
      })
      .then((objectId: Types.ObjectId) => {
        return new Promise<boolean>((resolve, reject) => {
          Lessons.findByIdAndRemove(objectId, (err: any, lessonDoc: LessonDocument) => {
            if (err) {
              return reject(DbError.makeNew(err, `Database error happened in deleting id: ${id}`));
            }
            const deleted = typeof lessonDoc !== "undefined" && lessonDoc != null;
            return resolve(deleted);
          });
        });
      });
  }

  /**
   * Update a meetup on a lesson
   * @param lessonId the id of the lesson to update on
   * @param studentId the id of the student to update
   * @param meetUp the new meetUp
   */
  public updateMeetUp(user: IUser, lessonId: string, studentId: string, meetUp: IMeetUp): Promise<IMeetUp> {
    //TODO better validation (also for converting lessonId and studentIds to objectId)
    return this.getPopulated(Lessons.findOneAndUpdate(
      { "_id": lessonId, "meetUps.student": studentId },
      {
        "$set": {
          "meetUps.$.checkIn": meetUp.checkIn,
          "meetUps.$.checkOut": meetUp.checkOut,
          "meetUps.$.topic": meetUp.topic,
        }
      }), false, true)
      .exec((err: any, lessonDocument) => {
        if (err) {
          throw DbError.makeNew(err, `Database error happened in updating meetup`);
        }
        return lessonDocument;
      })
      .then(lessonDoc => {
        return meetUp;
        //TODO make this return the new meetUp in db, because lessonDoc right now is the object in db before it gets updated
        //return this.getLessonObj(lessonDoc);
        //})
        //.then(lesson => {
        //  console.log("here?", lesson);
        //  return <IMeetUp>lesson.meetUps.find(x => { return x.student.id == studentId })
      }).catch(err => {
        console.log("here?", err);
        throw err;
      });
  }

  /**
   * Make a Lesson object from a DbLesson object
   * @param dbLesson - the dbLesson object to convert
   */
  private getLessonObj(dbLesson: LessonDocument): Lesson {
    const lesson = dbLesson.toObject() as any;
    //check and set objectIds to strings for teachers
    const firstTeacher = lesson.teachers[0];
    if (firstTeacher && firstTeacher instanceof Types.ObjectId) {
      lesson.teachers = lesson.teachers.map((value: Types.ObjectId) => {
        return value.toString();
      });
    }
    //check and set objectIds to strings for student
    const firstMeetUp = lesson.meetUps[0];
    if (firstMeetUp && firstMeetUp.student && firstMeetUp.student instanceof Types.ObjectId) {
      lesson.meetUps = lesson.meetUps.map((value: any) => {
        value.student = value.student.toString();
        return value;
      });
    }
    //make schoolClasses strings to objects
    const schoolClasses = lesson.schoolClasses;
    if (schoolClasses) {
      lesson.schoolClasses = schoolClasses.map((value: string) => { return new SchoolClass(value); });
    }

    return lesson;
  }

  /**
   * Method for make MeetUp object to DbMeetUp object
   */
  private getMeetUpsAsDbObjects(meetUps: MeetUp[]): DbMeetUp[] {
    return meetUps.map((value) => {
      const newDbMeetUp = new DbMeetUp();
      newDbMeetUp.checkIn = value.checkIn;
      newDbMeetUp.checkOut = value.checkOut;
      newDbMeetUp.topic = value.topic;
      newDbMeetUp.student = Types.ObjectId(value.student.id);
      return newDbMeetUp;
    });
  }
}
