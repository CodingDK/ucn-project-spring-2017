import { validate, ValidationError } from "class-validator";

import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { LessonDal } from '../dal/lessonDAL';
import { CreateLessonViewModel } from '../viewmodels/createLessonViewModel';
import { ResponseError } from '../errors/responseError';


import { UserController } from './userController';
import { BaseController } from './baseController';

/**
 * Controller for handling Lessons
 */
export class LessonController extends BaseController {

  private dal: LessonDal = new LessonDal();
  private userCtrl = new UserController();

  /**
   * Method for Getting All Lessons
   */
  public getAll(user: any): Promise<Lesson[]> {
    return this.dal.getAll(user)
      .catch(this.errorHandler.bind(this));
  }

  /**
   * Method for find a lesson by id
   */
  public findById(user: any, id: string): Promise<Lesson> {
    return this.dal.findById(user, id)
      .catch(this.errorHandler.bind(this))
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
        return this.userCtrl.findStudentsBySchoolClassNames(user, viewModel.schoolClassNames)
          .catch((err: any) => {
            throw ResponseError.makeNew(err, `Error happen in finding students`);
          })
      })
      .then((students) => {
        return this.dal.createLesson(user, viewModel, students);
      })
      .catch(this.errorHandler.bind(this))
      
      
  }
  
  /**
   * Delete a lesson from the database by id
   * @param id the id to delete from database
   */
  public deleteById(user: any, id: string): Promise<boolean> {
    return this.dal.deleteById(user, id)
      .catch(this.errorHandler.bind(this));
  }
  
  ///**
  // * Method for find a lesson by id
  // * @param id
  // */
  //public findById(id: string): Promise<Lesson> {
  //  return this.dal.findById(id);
  //}

  ///**
  // * Method for find a lesson by a date
  // * @param lessonDate
  // */
  //public findBydate(lessonDate: Date): Promise<Lesson> {
  //  return this.dal.findByDate(lessonDate);
  //}

  ///**
  // * Method for find a lesson by a daterange between two dates
  // * @param lessonDates
  // */
  //public findByDateRange(lessonDates: Date[]): Promise<Lesson> {
  //  return this.dal.findByDateRange(lessonDates);
  //}

  ///**
  // * Method for find a lesson by teacher
  // * @param teacher
  // */
  //public findByTeacher(teacher: string): Promise<Lesson> {
  //  return this.dal.findByTeacher(teacher);
  //}

  ///**
  // * Method for find a lesson by the school class
  // * @param schoolClass
  // */
  //public findBySchoolClass(schoolClass: string): Promise<Lesson> {
  //  return this.dal.findBySchoolClass(schoolClass);
  //}

  // public findByStartTime(): Promise<Lesson> {}
  // public findByEndTime(): Promise<Lesson> {}
}