import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";
import { GoogleController } from '../controllers/googleController';
import { BaseRouter } from './baseRouter';

import { User } from '../models/user';
import { ResponseError } from '../errors/responseError';
import { UserController } from "../controllers/userController";

class LoginRouter extends BaseRouter {
  ctrl: GoogleController;

  /**
   * Initialize the LoginRouter
   */
  constructor() {
    super();
    this.ctrl = new GoogleController();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init() {
    const router = this.router;
    router.post("/signup", passport.authenticate('local-signup'),
      (req: Request, res: Response) => {
        // `req.user` contains the authenticated user.
        res.json({ login: true });
      }
    );
    // login method
    router.post("/", passport.authenticate('local'),
      (req: Request, res: Response) => {
        // `req.user` contains the authenticated user.
        res.json({ login: true });
      }
    );

    router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
      req.logout();
      if (req.session != null) {
        req.session.destroy(() => {});
      }
      res.json({ login: false });
      //res.redirect('/');
    });

    router.get("/status", this.getStatus.bind(this));

    // POST /auth/google
    router.post('/auth/google', this.loginWithGoogle.bind(this));

    //POST /simple
    router.post('/simple', this.loginSimple.bind(this));
  }

  private getStatus(req: Request, res: Response, next: NextFunction) {
    // `req.user` contains the authenticated user.
    let user = req.user;
    console.log("user", user);
    if (!user) {
      this.send(res, null, "User not logged in", false);
    } else {
      let safeUser = this.getClientSafeUser(req.user);
      this.send(res, safeUser, "User is logged in");
    }
  }

  private loginWithGoogle(req: Request, res: Response, next: NextFunction) {
    //Get auth_code from request
    const auth_code = req.body.auth_code;
    this.ctrl.login(auth_code)
      .then((user: User) => {
        //Logging in with the found or new user
        req.login(user, (err: any) => {
          if (err) {
            throw ResponseError.makeNew(err, "Error in logging user in with google route, passport part");
          }
          let safeUser = this.getClientSafeUser(user);
          this.send(res, safeUser, "Succes logging in with Google")
          //res.json({ login: true, isGoogleUsed: true, message: "ok" });
        });
      })
      .catch((err: any) => {
        /*let errorMessage = "An unknown error happen"
        if (err instanceof ResponseError) {
          errorMessage = err.message;
        }
        this.errorHandler(res, err, errorMessage);*/
        return next(err);
      });
  }

  private loginSimple(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const userCtrl = new UserController();
    userCtrl.findById(null, userId)
      .then((user: User) => {
        if (!user) {
          throw ResponseError.makeNew(new Error("User is not defined"), "Error in logging user in with simple login");
        }
        //Logging in with the found user
        req.login(user, (err: any) => {
          if (err) {
            throw ResponseError.makeNew(err, "Error in logging user in with simple login, passport part");
          }
          let safeUser = this.getClientSafeUser(user);
          this.send(res, safeUser, "Succes logging in with Simple")
          //res.json({ login: true, isGoogleUsed: true, message: "ok" });
        });
      })
      .catch((err: any) => {
        /*let errorMessage = "An unknown error happen"
        if (err instanceof ResponseError) {
          errorMessage = err.message;
        }
        this.errorHandler(res, err, errorMessage);*/
        return next(err);
      });
  }
}

// Create the loginRoutes, and export its configured Express.Router
const loginRoutes = new LoginRouter();

export default loginRoutes.router;
