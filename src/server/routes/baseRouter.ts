import { Router, Response } from 'express';

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
}