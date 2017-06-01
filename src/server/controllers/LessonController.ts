import { validate, ValidationError } from "class-validator";

import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { User } from '../models/user';
import { SchoolClass } from '../models/schoolClass';
import { LessonDAL } from '../dal/lessonDAL';
import { ILessonDAL } from '../interfaces/dal/iLessonDAL';

import { CreateLessonViewModel } from '../models/viewmodels/createLessonViewModel';
import { IMeetUp, IUser } from '../../shared/interfaces/iModels';
import { ResponseError } from '../errors/responseError';

import { UserController } from './userController';
import { BaseController } from './baseController';

import { hasRequiredRole } from '../common/common';

/**
 * Controller for handling Lessons
 */
export class LessonController extends BaseController {

  private dal: ILessonDAL = new LessonDAL();
  private userCtrl = new UserController();

  /**
   * Method for Getting All Lessons
   */
  public getAll(user: any, populateTeacher?: boolean, populateStudent?: boolean, onlyActive?: boolean): Promise<Lesson[]> {
    return this.dal.getAll(user, populateTeacher, populateStudent, onlyActive)
      .catch(this.errorHandler.bind(this));
  }

  /**
   * Method for find a lesson by id
   */
  public findById(user: any, id: string, populateTeacher?: boolean, populateStudent?: boolean): Promise<Lesson> {
    return this.dal.findById(user, id, populateTeacher, populateStudent)
      .catch(this.errorHandler.bind(this));
  }

  /**
   * Method for creating a new lesson
   * @param viewModel the new lesson to create
   */
  public createLesson(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    return validate(viewModel, { validationError: { target: false } })
      .then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
          //console.log("validation failed. errors: ", errors);
          throw ResponseError.makeNew(errors, "validation failed");
        }
      })
      .then(() => {
        return this.createLessonFromViewModel(user, viewModel);
      })
      .then(newLesson => {
        return this.dal.insert(user, newLesson);
      })
      .catch(this.errorHandler.bind(this));
  }

  /**
   * Method for updatering a lesson
   * @param viewModel the lesson to update with the new informations
   */
  public updateLesson(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    return validate(viewModel, { validationError: { target: false } })
      .then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
          //console.log("validation failed. errors: ", errors);
          throw ResponseError.makeNew(errors, "validation failed");
        }
      })
      .then(() => {
        return this.createLessonFromViewModel(user, viewModel);
      })
      .then(lesson => {
        return this.dal.update(user, lesson);
      })
      .catch(this.errorHandler.bind(this));
  }

  private createLessonFromViewModel(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    return this.userCtrl.findStudentsBySchoolClassNames(user, viewModel.schoolClassNames)
      .catch((err: any) => {
        throw ResponseError.makeNew(err, `Error happen in finding students`);
      })
      .then((students) => {
        const newLesson = new Lesson();
        newLesson.id = <string>viewModel.id;
        newLesson.startTime = viewModel.startTime;
        newLesson.endTime = viewModel.endTime;
        newLesson.schoolClasses = viewModel.schoolClassNames.map((value) => { return new SchoolClass(value); });
        newLesson.teachers = viewModel.teachers.map(value => {
          const teacher = new User();
          teacher.id = value;
          return teacher;
        });
        newLesson.meetUps = students.map(value => { return new MeetUp(value); });
        return newLesson;
      });
  }

  /**
   * Delete a lesson from the database by id
   * @param id the id to delete from database
   */
  public deleteById(user: any, id: string): Promise<boolean> {
    return this.dal.deleteById(user, id)
      .catch(this.errorHandler.bind(this));
  }

  /**
   * Update a meetup on a lesson
   * @param lessonId the id of the lesson to update on
   * @param studentId the id of the student to update
   * @param meetUp the new meetUp
   */
  public updateMeetUp(user: IUser, lessonId: string, studentId: string, meetUp: IMeetUp) {
    return new Promise<void>((resolve, reject) => {
      if (hasRequiredRole(user, ['student']) && user.id !== studentId) {
        return reject(ResponseError.makeNew(
          new Error("UserId and studentId not matching"),
          "You dont have access to update others meetUps", 403
          ));
      }
      return resolve();
    })
    .then(() => {
      return this.dal.updateMeetUp(user, lessonId, studentId, meetUp);
    })
    .catch(this.errorHandler.bind(this));
  }

  public findMeetUp(user: IUser, lessonId: string, studentId: string): Promise<IMeetUp> {
    return this.dal.findMeetUp(user, lessonId, studentId)
      .catch(this.errorHandler.bind(this));
  }
}
