import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { Student } from '../../shared/models/user'; 
import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';
import { DbLesson, LessonDocument, Lessons, DbMeetUp } from './models/dbLesson';
import { DbError } from '../errors/dbError';

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
  public createLesson(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    return this.userDal.findStudentsBySchoolClassName(viewModel.schoolClassName)
      .then((students: Student[]) => {
        let dbLesson = new DbLesson();
        dbLesson.startTime = viewModel.startTime;
        dbLesson.endTime = viewModel.endTime;
        dbLesson.schoolClass = viewModel.schoolClassName;
        dbLesson.teachers = viewModel.teachers;
        dbLesson.meetUps = students.map((value) => {
          let dbMeetUp = new DbMeetUp();
          dbMeetUp.student = value.id;
          return dbMeetUp;
        });
        return dbLesson;
      })
      .catch((err: any) => {
        throw DbError.makeNew(err, `Error happen in finding students and attach them to a dbLesson`);
      })
      .then((dbLesson: DbLesson) => {
        return Lessons.create(dbLesson);
      })
      .then((createdLesson: LessonDocument) => {
        return this.getLessonObj(createdLesson);
      })
      .catch((err: any) => {
        let retError = err;
        if (!(err instanceof DbError)) {
          retError = DbError.makeNew(err, `Error happened in creating a new lesson in database`);
        }
        throw retError;
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
  
}