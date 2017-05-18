import { validate, ValidationError } from "class-validator";

import { Lesson } from '../models/lesson';
import { MeetUp } from '../models/meetUp';
import { User } from '../models/user';
import { SchoolClass } from '../models/schoolClass';
import { LessonDAL } from '../dal/lessonDAL';
import { ILessonDAL } from '../interfaces/dal/iLessonDAL';

import { CreateLessonViewModel } from '../models/viewmodels/createLessonViewModel';
import { ResponseError } from '../errors/responseError';


import { UserController } from './userController';
import { BaseController } from './baseController';

/**
 * Controller for handling Lessons
 */
export class LessonController extends BaseController {

  private dal: ILessonDAL = new LessonDAL();
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
        let newLesson = new Lesson();
        newLesson.id = <string>viewModel.id;
        newLesson.startTime = viewModel.startTime;
        newLesson.endTime = viewModel.endTime;
        newLesson.schoolClasses = viewModel.schoolClassNames.map((value) => { return new SchoolClass(value) });
        newLesson.teachers = viewModel.teachers.map(value => {
          let teacher = new User();
          teacher.id = value;
          return teacher;
        })
        newLesson.meetups = students.map(value => { return new MeetUp(value) });
        return newLesson; 
      })
      .then(newLesson => {
        return this.dal.insert(user, newLesson);
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