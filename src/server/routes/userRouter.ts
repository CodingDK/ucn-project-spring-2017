import { Router, Request, Response, NextFunction } from 'express';

import { BaseRouter } from './baseRouter';
import { UserController } from '../controllers/userController';
import { User } from '../../shared/models/user';

class UserRouter extends BaseRouter {
  ctrl: UserController;

  /**
   * Initialize the UserRouter
   */
  constructor() {
    super();
    this.ctrl = new UserController();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init() {
    //GET all lessons
    this.router.get('/', this.getAll.bind(this));
    //GET single lesson
    this.router.get('/:id', this.getSingle.bind(this));
  }

  /**
   * Get all Users
   */
  private getAll(req: Request, res: Response, next: NextFunction): void {
    let roles = req.query.roles;
    if (typeof roles === "string") roles = [roles];

    this.ctrl.getAll(req.user, roles)
      .then((users: User[]) => {
        return users.map((user) => { return this.secureUser(user)});
      })
      .then((users: User[]) => {
        this.send(res, users);
      })
      .catch((err: any) => {
        return next(err);
      });
  }

  /**
   * Get single User
   */
  private getSingle(req: Request, res: Response, next: NextFunction): void {
    this.ctrl.findById(req.user, req.params['id'])
      .then((user: User) => {
        return this.secureUser(user);
      })
      .then((user: User) => {
        this.send(res, user);
      })
      .catch((err: any) => {
        return next(err);
      });
  }

  /**
   * Remove secrets fields before sending it to client
   */
  private secureUser(user: User): User {
    if (user == undefined || user == null) return user;
    delete user.googleTokens;
    delete user.password;
    return user;
  }
  
}

// Create the UserRouter, and export its configured Express.Router
const userRouter = new UserRouter();

export default userRouter.router;