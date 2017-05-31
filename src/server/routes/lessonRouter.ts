import { Request, Response, NextFunction } from 'express';

import { BaseRouter } from './baseRouter';
import { LessonController } from '../controllers/lessonController';
import { Lesson } from '../models/lesson';
import { CreateLessonViewModel } from '../models/viewmodels/createLessonViewModel';
import { IMeetUp } from '../../shared/interfaces/iModels';

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
    this.router.use(this.isLoggedIn.bind(this));

    //GET all lessons
    this.router.get('/', this.getAll.bind(this));

    //GET single lesson
    this.router.get('/:id', this.getSingle.bind(this));

    //POST create new lesson
    this.router.post('/', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['admin']);
    }, this.createLesson.bind(this));

    //PUT update lesson
    this.router.put('/', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['admin']);
    }, this.updateLesson.bind(this));

    //DELETE delete a lesson
    this.router.delete('/:id', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['admin']);
    }, this.deleteLesson.bind(this));

    //PUT update meetUp for a student
    this.router.put('/:lessonId/meetup/:studentId', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['teacher']);
    }, this.updateMeetUp.bind(this));
  }

  /**
   * Get all Lessons
   */
  private getAll(req: Request, res: Response, next: NextFunction): void {
    const populateTeacher = req.query.populateTeacher;
    const populateStudent = req.query.populateStudent;
    this.ctrl.getAll(req.user, populateTeacher, populateStudent)
      .then((lessons: Lesson[]) => {
        return this.send(res, lessons);
        //next();
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Get single Lessons
   */
  private getSingle(req: Request, res: Response, next: NextFunction): void {
    let populateTeacher = req.query.populateTeacher;
    if (typeof populateTeacher === "string") {
      populateTeacher = (populateTeacher === 'true');
    }
    let populateStudent = req.query.populateStudent;
    if (typeof populateStudent === "string") {
      populateStudent = (populateStudent === 'true');
    }

    this.ctrl.findById(req.user, req.params['id'], populateTeacher, populateStudent)
      .then((lesson: Lesson) => {
        return this.send(res, lesson);
        //next();
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Create a new Lesson
   */
  private createLesson(req: Request, res: Response, next: NextFunction): void {
    const viewModel = this.parseToObject(req.body, CreateLessonViewModel);
    this.ctrl.createLesson(req.user, viewModel)
      .then((lesson: Lesson) => {
        return this.send(res, lesson);
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Update a Lesson
   */
  private updateLesson(req: Request, res: Response, next: NextFunction): void {
    const viewModel = this.parseToObject(req.body, CreateLessonViewModel);
    this.ctrl.updateLesson(req.user, viewModel)
      .then((lesson: Lesson) => {
        return this.send(res, lesson);
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  /**
   * Delete a Lesson
   */
  private deleteLesson(req: Request, res: Response, next: NextFunction): void {
    this.ctrl.deleteById(req.user, req.params['id'])
      .then((deleted: boolean) => {
        return this.send(res, deleted);
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }

  private updateMeetUp(req: Request, res: Response, next: NextFunction): void {
    //TODO validation for req.body is a real meetUp
    const lessonId = req.params['lessonId'];
    const studentId = req.params['studentId'];
    this.ctrl.updateMeetUp(req.user, lessonId, studentId, req.body)
      .then((meetUp: IMeetUp) => {
        return this.send(res, meetUp);
      })
      .catch((err: any) => {
        //this.errorHandler(res, err, err.message);
        return next(err);
      });
  }
}

// Create the LessonRouter, and export its configured Express.Router
const lessonRoutes = new LessonRouter();

export default lessonRoutes.router;
