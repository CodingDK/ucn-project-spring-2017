import { Router, Request, Response, NextFunction } from 'express';

import { BaseRouter } from './baseRouter';
import { LessonController } from '../controllers/lessonController';
import { Lesson } from '../../shared/models/lesson';
import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';

class LessonRouter extends BaseRouter {
  ctrl: LessonController;

  /**
   * Initialize the LessonRouter
   */
  constructor() {
    super();
    this.ctrl = new LessonController();
    this.init();
  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init() {

    this.router.get('/getTestObject', this.getTestObject.bind(this));
    this.router.get('/getTestObjectCreate', this.getTestObjectCreate.bind(this));
    //GET all lessons
    this.router.get('/', this.getAll.bind(this));
    //GET single lesson
    this.router.get('/:id', this.getSingle.bind(this));
    //POST create new lesson
    this.router.post('/', this.createLesson.bind(this));
    //PUT update lesson
    //this.router.put('/', this.ctrl.updateLesson);
    //DELETE delete a lesson
    //this.router.delete('/', this.ctrl.deleteLesson);
  }

  /**
   * Get all Lessons
   */
  public getAll(req: Request, res: Response, next: NextFunction): void {
    this.ctrl.getAll(req.user)
      .then((lessons: Lesson[]) => {
        return this.send(res, lessons, "lesson created");
        //next();
      })
      .catch((err: any) => {
        this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Get single Lessons
   */
  public getSingle(req: Request, res: Response, next: NextFunction): void {
    this.ctrl.findById(req.user, req.params['id'])
      .then((lesson: Lesson) => {
        return this.send(res, lesson);
        //next();
      })
      .catch((err: any) => {
        this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Create a new Lesson
   */
  public createLesson(req: Request, res: Response, next: NextFunction): void {
    const viewModel = this.parseToObject(req.body, CreateLessonViewModel);
    this.ctrl.createLesson(req.user, viewModel)
      .then((lesson: Lesson) => {
        return this.send(res, lesson);
      })
      .catch((err: any) => {
        this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  private getTestObject(req: Request, res: Response, next: NextFunction) {
    let startTime = new Date(new Date().getTime() + 1000 * 60 * 60);
    let endDate = new Date(startTime.getTime());
    let lesson = Lesson.createNew(startTime, endDate, "pwe0916", ["1"]);
    return this.send(res, lesson); 
  }

  private getTestObjectCreate(req: Request, res: Response, next: NextFunction) {
    let startTime = new Date(new Date().getTime() + 1000 * 60 * 60);
    let endDate = new Date(startTime.getTime());
    /*let obj = new CreateLessonViewModel({
      startTime: startTime,
      endTime: endDate,
      schoolClassName: "pwe0916",
      teachers: ["1"]
    });*/
    let obj = new CreateLessonViewModel();
    obj.startTime = startTime;
    obj.endTime = endDate;
    obj.schoolClassName = "pwe0916";
    obj.teachers = ["1"];   
    return this.send(res, obj); 
  }
}

// Create the LessonRouter, and export its configured Express.Router
const lessonRoutes = new LessonRouter();

export default lessonRoutes.router;