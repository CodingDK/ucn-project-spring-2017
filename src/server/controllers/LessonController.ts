import { validate, validateSync } from "class-validator";
import { transformAndValidate } from "class-transformer-validator";

import { Lesson } from '../../shared/models/lesson';
import { MeetUp } from '../../shared/models/meetUp';
import { LessonDal } from '../dal/lessonDAL';
import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';


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
    return this.dal.findById(user, id);
  }


  /**
   * Method for creating a new lesson
   * @param lesson the new lesson to create
   */
  public createLesson(user: any, viewModel: CreateLessonViewModel): Promise<Lesson> {
    console.log("viewModel", viewModel);
    transformAndValidate(CreateLessonViewModel, viewModel)
      .then((userObject: CreateLessonViewModel) => {
        // now you can access all your class prototype method
        console.log(`Hello: ${userObject}`); // prints "Hello World!" on console
      })
      .catch(error => {
        // here you can handle error on transformation (invalid JSON)
        // or validation error (e.g. invalid email property)
        console.log("catch", error);
      });
    let errors = validateSync(viewModel);
    console.log("error: ", errors);

    if (errors.length > 0) {
      console.log("sync, validation failed. errors: ", errors);
    } else {
      console.log("sync, validation succeed");
    }
    validate(viewModel).then(errors => { // errors is an array of validation errors
      console.log("error: ", errors);
      if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
      } else {
        console.log("validation succeed");
      }
    });
    //TODO validations!
    //TODO validation on teachers id
    let lesson: Lesson = new Lesson();
    return this.userCtrl.findStudentsBySchoolClassName(lesson.schoolClass.name)
      .then(students => {
        lesson.meetups = students.map(student => {
          return new MeetUp(student);
        })
        return lesson;
      })
      //TODO Handle if no students was found
      .catch(err => {
        throw err;
      })
      .then(lesson => {
        return this.dal.createLesson(user, lesson);
      });
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