import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './baseRouter';

// controllers
import { StudentController } from '../controllers/studentController';

// models
import { Lesson } from '../../shared/models/lesson';
//import { MeetUp } from '../../shared/models/meetUp';
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
        //this.router.get('/student/getTestObject', this.getTestObject.bind(this));
        //this.router.get('/getTestObjectCreate', this.getTestObjectCreate.bind(this));

        // POST student checkin (meetup)
        this.router.post('/', this.studentCheckIn.bind(this));
        // PUT student checkout (meetup)
        this.router.put('/', this.studentCheckOut.bind(this));
        // PUT student update student's topic
        this.router.put('/topic', this.setStudentTopic.bind(this));
        // GET get activate lessons
        this.router.get('/active', this.getActiveLessons.bind(this));       
    }

    private studentCheckIn(req: Request, res: Response, next: NextFunction): string {
        return "hello";
    }

    private studentCheckOut(req: Request, res: Response, next: NextFunction): void {
        // TODO:
    }

    private setStudentTopic(req: Request, res: Response, next: NextFunction): string {
        return 'set student topic';
    }

    private getActiveLessons(req: Request, res: Response, next: NextFunction): void {
        console.log('get active lessons - router');

        this.ctrl.getActiveLessons();

        //this.ctrl.getActiveLessons(req.user)
        //    .then((lessons: Lesson[]) => {
        //        return this.send(res, lessons);
        //    })
        //    .catch((err: any) => {
        //        return next(err);
        //    });            
    } 

}

// Create the LessonRouter, and export its configured Express.Router
const studentRoutes = new StudentRouter();

export default studentRoutes.router;
