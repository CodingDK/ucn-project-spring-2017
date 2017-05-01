import { Router, Response } from 'express';

import { User, Teacher, Student } from '../../shared/models/user';

export abstract class BaseRouter {
  router: Router = Router();

  public send(res: Response, data: any, message: string = "", succus: boolean = true): void {
    res.json({
      data,
      message,
      succus
    });
  }

  public errorHandler(res: Response, err: any, message: string = "") {
    res.json(400, {
      data: err,
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
    console.log("instanceof", user instanceof Teacher, user instanceof Student)
    if (user instanceof Teacher) {
      let retTeacher = retUser as Teacher;
      retTeacher.roles = user.roles;
      retUser = retTeacher;
    }
    return retUser;
  }
}