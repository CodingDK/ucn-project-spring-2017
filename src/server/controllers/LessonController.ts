import { validate, ValidationError } from "class-validator";

import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { LessonDal } from '../dal/lessonDAL';
import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';
import { ResponseError } from '../errors/responseError';
import { DbError } from '../errors/dbError';


import { UserController } from './userController';

/**
 * Controller for handling Lessons
 */
export class LessonController {

  private dal: LessonDal = new LessonDal();
  private userCtrl = new UserController();

  /**
   * Method for Getting All Lessons
   */
  public getAll(user: any): Promise<Lesson[]> {
    return this.dal.getAll(user);
  }

  /**
   * Method for find a lesson by id
   */
  public findById(user: any, id: string): Promise<Lesson> {
    return this.dal.findById(user, id)
      .catch((err: any) => {
        throw ResponseError.makeNew(err, "a database error happened");
      });
  }
  
  /**
   * Method for creating a new lesson
   * @param viewModel the new lesson to create
   */
  public createLesson(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    return validate(viewModel, { validationError: { target: false} })
      .then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
          //console.log("validation failed. errors: ", errors);
          throw ResponseError.makeNew(errors, "validation failed");
        } else {
          //console.log("validation succeed");
          return viewModel;
        }
      })
      .then((viewModel: CreateLessonViewModel) => {
        //TODO validate teachers and schoolClass exists
        return this.dal.createLesson(user, viewModel);
      })
      .catch(error => {
        if (error instanceof ResponseError) {
          throw error;
        } else { //if (error instanceof DbError) {
          throw ResponseError.makeNew(error, "a database error happened")
        }
      });
  }

  /**
   * Delete a lesson from the database by id
   * @param id the id to delete from database
   */
  public deleteById(user: any, id: string): Promise<boolean> {
    return this.dal.deleteById(user, id);
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