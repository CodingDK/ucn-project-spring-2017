import { Router, Response, Request, NextFunction, RequestHandler } from 'express';
import { ValidationError } from 'class-validator';

import { ResponseError } from '../errors/responseError';

import { User } from '../models/user';
import { TypedJSON, SerializerSettings } from "typedjson-npm";
import { IUser } from "../../shared/interfaces/iModels";

export abstract class BaseRouter {
  router: Router = Router();

  protected handleHasRoleAccess(req: Request, res: Response, next: NextFunction, roles: string[]) {
    const user = req.user as IUser;
    if (user == null) {
      //return this.sendNotLoggedIn(res);
    }
    const hasRequiredRole = user.roles.some(x => { return roles.indexOf(x) !== -1; });
    if (!hasRequiredRole) {
      return this.send(res, {}, "You are not allowed to access this data", false, 403);
    }
    next();
  }

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
    this.sendNotLoggedIn(res);
  }

  public send(res: Response, data: any, message: string = "", succus: boolean = true, statusCode?: number): void {
    if (statusCode != null) {
      res.status(statusCode);
    }
    res.json({
      data,
      message,
      succus
    });
  }

  private sendNotLoggedIn(res: Response) {
    this.send(res, {}, "You are not logged in!", false, 401);
    /*res.status(401).json({
      data: {},
      message: "Your are not logged in!",
      succus: false
    });*/
  }

  public errorHandler(res: Response, err: any, message: string = "") {
    let data = err;
    //check if parentError is validationErrors and send them as data object instead
    if (err instanceof ResponseError) {
      const parent = err.getParentError();
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
    const retUser = new User();
    retUser.googleId = user.googleId;
    retUser.imageUrl = user.imageUrl;
    retUser.id = user.id;
    retUser.name = user.name;
    retUser.roles = user.roles;
    retUser.schoolClasses = user.schoolClasses;
    return retUser;
  }

  public parseToObject<T>(body: any, type: { new (): T; }, settings?: SerializerSettings): T {
    return TypedJSON.parse(JSON.stringify(body), type);
  }
}
