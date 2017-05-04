import { Router, Response, Request, NextFunction } from 'express';
import { ValidationError } from 'class-validator';

import { ResponseError } from '../errors/responseError';

import { User, Teacher, Student } from '../../shared/models/user';
import { TypedJSON, SerializerSettings } from "typedjson-npm";

export abstract class BaseRouter {
  router: Router = Router();

  /**
   * Function for check if a user is logged in or not
   * It will send a 401 to res parameter, if the user is not logged in.
   * @param req the request
   * @param res the response
   * @param next callback / that to do next
   */
  public isLoggedIn(req: Request, res: Response, next: NextFunction): void {
    // if user is authenticate in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }
    //res.redirect('/');
    res.status(401).json({
      data: {},
      message: "Your are not logged in!",
      succus: false
    });
  }

  public send(res: Response, data: any, message: string = "", succus: boolean = true): void {
    res.json({
      data,
      message,
      succus
    });
  }

  public errorHandler(res: Response, err: any, message: string = "") {
    let data = err;
    //check if parentError is validationErrors and send them as data object instead
    if (err instanceof ResponseError) {
      let parent = err.getParentError();
      if (typeof parent[0] !== 'undefined' && parent[0] instanceof ValidationError) {
        data = parent;
      }
    }

    res.status(400).json({
      data: data,
      message,
      succus: false
    });
  }

  public getClientSafeUser(user: User): User {
    let retUser = new User();
    retUser.googleId = user.googleId;
    retUser.imageUrl = user.imageUrl;
    retUser.id = user.id;
    retUser.name = user.name;
    if (user instanceof Teacher) {
      let retTeacher = retUser as Teacher;
      retTeacher.roles = user.roles;
      retUser = retTeacher;
    }
    return retUser;
  }

  public parseToObject<T>(body: any, type: { new (): T; }, settings?: SerializerSettings): T {
    return TypedJSON.parse(JSON.stringify(body), type);
  }
}