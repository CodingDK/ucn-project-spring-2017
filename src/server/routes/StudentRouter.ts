import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './baseRouter';

// controllers
import { StudentController } from '../controllers/studentController';

// models
import { Lesson } from '../models/lesson';
//import { MeetUp } from '../models/meetUp';
//import { CreateLessonViewModel } from '../../shared/viewmodels/createLessonViewModel';


class StudentRouter extends BaseRouter {
    ctrl: StudentController;

    /**
    * Initialize the LessonRouter
    */
    constructor() {
        super();
        this.ctrl = new StudentController();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        // POST student checkin (meetup)
        this.router.put('/:lessonId/meetup/:studentId/checkin', this.studentCheckIn.bind(this));
        // PUT student checkout (meetup)
        this.router.put('/:lessonId/meetup/:studentId/checkout', this.studentCheckOut.bind(this));
        // PUT student update student's topic
        this.router.put('/:lessonId/meetup/:studentId/topic/:topic', this.setStudentTopic.bind(this));
        // GET get activate lessons
        this.router.get('/active', this.getActiveLessons.bind(this));       
    }

    private studentCheckIn(req: Request, res: Response, next: NextFunction): void {
        
        this.ctrl.studentCheckIn(req.user, req.params['lessonId'], req.params['studentId'])
            .then((isCheckedIn: boolean) => {                
                return this.send(res, isCheckedIn);
            })
            .catch((err: any) => {
                return next(err);
            });
    }

    private studentCheckOut(req: Request, res: Response, next: NextFunction): void {
        this.ctrl.studentCheckIn(req.user, req.params['lessonId'], req.params['studentId'])
            .then((isCheckedIn: boolean) => {
                return this.send(res, isCheckedIn);
            })
            .catch((err: any) => {
                return next(err);
            });
    }

    private setStudentTopic(req: Request, res: Response, next: NextFunction): void {
        this.ctrl.setStudentTopic(req.user, req.params['lessonId'], req.params['studentId'], req.params['topic'])
            .then((topicHasChanged: boolean) => {
                return this.send(res, topicHasChanged);
            })
            .catch((err: any) => {
                return next(err);
            });
    }

    private getActiveLessons(req: Request, res: Response, next: NextFunction): void {
        
        this.ctrl.getActiveLessons(req.user)
            .then((lessons: Lesson[]) => {
                return this.send(res, lessons);
            })
            .catch((err: any) => {
                return next(err);
            });               
    } 
}

// Create the LessonRouter, and export its configured Express.Router
const studentRoutes = new StudentRouter();
export default studentRoutes.router;
