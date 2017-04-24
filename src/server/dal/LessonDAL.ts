import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';

import { UserDal } from './userDAL';

/**
 * Class for handling Lessons in database
 */
export class LessonDal {
  private userDal = new UserDal();

  public getAll(user: any): Promise<Lesson[]> {
    return new Promise<Lesson[]>((resolve, reject) => {
      Lessons.find({}, (err: any, objs: LessonDocument[]) => {
        if (err) {
          reject(err);
        }
        let retList = new Array<Lesson>();
        if (objs != null) {
          objs.forEach((value: LessonDocument) => {
            retList.push(this.getLessonObj(value));
          });
        }
        resolve(retList);
      })
    });
  }

  /**
    * Method for find a lesson by the id
    * @param id the id to look for
    */
  public findById(user: any, id: string): Promise<Lesson> {
    return new Promise<Lesson>((resolve, reject) => {
      Lessons.findById(id, (err, lessonDoc: LessonDocument) => {
        //console.log("id?", id);
        //console.log("err?", err);
        if (err) {
          reject(err);
        }
        if (lessonDoc != null) {
          resolve(this.getLessonObj(lessonDoc));
        }
        resolve(undefined);
      });
    });
  }
  
  /**
   * Method for creating a new lesson
   * @param newLesson
   */
  public createLesson(user: any, lesson: Lesson): Promise<Lesson> {
    
    return new Promise<Lesson>((resolve, reject) => {
      let dbLesson = new DbLesson();
          dbLesson.startTime = lesson.startTime;
          dbLesson.endTime = lesson.endTime;
          dbLesson.schoolClass = lesson.schoolClass.name;
          dbLesson.teachers = lesson.teachers.map((value) => {
            return value.id;
          });
          dbLesson.meetUps = lesson.meetups.map((value) => {
            let dbMeetUp = new DbMeetUp();
            dbMeetUp.student = value.student.id;
            return dbMeetUp;
          });
      Lessons.create(dbLesson, (err: any, createdLesson: LessonDocument) => {
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
   * Make a Lesson object from a DbLesson object
   * @param dbLesson - the dbLesson object to convert
   */
  private getLessonObj(dbLesson: LessonDocument): Lesson {
    return dbLesson.toObject() as Lesson;
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
      newDbMeetUp.student = value.student.id;
      return newDbMeetUp;
    })
  }

  ///**
  // * 
  // * @param lessonDate
  // */
  //public findByDate(lessonDate: Date): Promise<Lesson> {
  //    // TODO: 
  //    return null;
  //}

  ///**
  // * 
  // * @param lessonDates
  // */
  //public findByDateRange(lessonDates: Date[]): Promise<Lesson> {
  //    // TODO: 
  //}

  ///**
  // * 
  // * @param teacher
  // */
  //public findByTeacher(teacher: string): Promise<Lesson> {
  //    // TODO: 
  //}

  ///**
  // * 
  // * @param schoolClass
  // */
  //public findBySchoolClass(schoolClass: string): Promise<Lesson> {
  //    // TODO:
  //}

  ///**
  // * 
  // * @param startTime
  // */
  //private findByStartTime(startTime: Date): Promise<Lesson> {
  //    return null;
  //}

  ///**
  // * 
  // * @param endTime
  // */
  //private findByEndTime(endTime: Date): Promise<Lesson> {
  //    return null;
  //}


}