import { Request, Response, NextFunction } from 'express';

import { BaseRouter } from './baseRouter';
import { LessonController } from '../controllers/lessonController';
import { Lesson } from '../models/lesson';
import { CreateLessonViewModel } from '../models/viewmodels/createLessonViewModel';
import { IMeetUp, IUser } from '../../shared/interfaces/iModels';
import { ResponseError } from "../errors/responseError";

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

    //PUT update meetUp topic
    this.router.put('/:lessonId/meetup/topic', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['student']);
    }, this.updateMeetUpTopic.bind(this));

    //POST add checkIn on meetUp
    this.router.post('/:lessonId/meetup/checkin', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['student']);
    }, this.addMeetUpCheckIn.bind(this));

    //POST add checkOut on meetUp
    this.router.post('/:lessonId/meetup/checkOut', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['student']);
    }, this.addMeetUpCheckOut.bind(this));

    //PUT update meetUp for a student
    this.router.put('/:lessonId/meetup/:studentId', (req, res, next) => {
      this.handleHasRoleAccess(req, res, next, ['teacher', 'student']);
    }, this.updateMeetUp.bind(this));

  }

  /**
   * Get all Lessons
   */
  private getAll(req: Request, res: Response, next: NextFunction): void {
    const populateTeacher = req.query.populateTeacher;
    const populateStudent = req.query.populateStudent;
    const onlyActive = req.query.onlyActive;
    this.ctrl.getAll(req.user, populateTeacher, populateStudent, onlyActive)
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

  /**
   * Update a meetup (for teachers)
   */
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

  /**
   * Update a meetup with topic (for students)
   */
  private updateMeetUpTopic(req: Request, res: Response, next: NextFunction): void {
    const lessonId = req.params['lessonId'];
    const user = req.user as IUser;
    const userId = user.id;
    const topic = (req.body as IMeetUp).topic;
    this.findMeetUp(user, lessonId, userId)
      .then(meetUp => {
        meetUp.topic = topic;
        return this.ctrl.updateMeetUp(user, lessonId, userId, meetUp);
      })
      .then(meetUp => {
        return this.send(res, meetUp);
      })
      .catch((err: any) => {
        return next(err);
      });
  }

  /**
   * Add checkIn on meetUp (for students)
   */
  private addMeetUpCheckIn(req: Request, res: Response, next: NextFunction): void {
    const lessonId = req.params['lessonId'];
    const user = req.user as IUser;
    const userId = user.id;
    const checkIn = new Date();
    this.findMeetUp(user, lessonId, userId)
      .then(meetUp => {
        if (meetUp.checkIn) {
          throw ResponseError.makeNew(new Error("CheckIn already set"), "CheckIn is already set on the meetUp");
        }
        return meetUp;
      })
      .then(meetUp => {
        meetUp.checkIn = checkIn;
        return this.ctrl.updateMeetUp(user, lessonId, userId, meetUp);
      })
      .then(meetUp => {
        return this.send(res, meetUp);
      })
      .catch((err: any) => {
        return next(err);
      });
  }

  /**
   * Add checkOut on meetUp (for students)
   */
  private addMeetUpCheckOut(req: Request, res: Response, next: NextFunction): void {
    const lessonId = req.params['lessonId'];
    const user = req.user as IUser;
    const userId = user.id;
    const checkOut = new Date();
    this.findMeetUp(user, lessonId, userId)
      .then(meetUp => {
        if (meetUp.checkOut) {
          throw ResponseError.makeNew(new Error("CheckOut already set"), "CheckOut is already set on the meetUp");
        } else if (!meetUp.checkIn) {
          throw ResponseError.makeNew(new Error("CheckOut error: CheckIn is not set"), "CheckOut can't be set before checkIn");
        }
        return meetUp;
      })
      .then(meetUp => {
        meetUp.checkOut = checkOut;
        return this.ctrl.updateMeetUp(user, lessonId, userId, meetUp);
      })
      .then(meetUp => {
        return this.send(res, meetUp);
      })
      .catch((err: any) => {
        return next(err);
      });
  }

  private findMeetUp(user: IUser, lessonId: string, studentId: string) {
    return this.ctrl.findMeetUp(user, lessonId, studentId)
      .then(meetUp => {
        if (!meetUp) {
          throw ResponseError.makeNew(new Error("MeetUp not found"), "meetUp cound be found in db");
        }
        return meetUp;
      });
  }
}

// Create the LessonRouter, and export its configured Express.Router
const lessonRoutes = new LessonRouter();

export default lessonRoutes.router;
