import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";
import { GoogleController } from '../controllers/googleController';
import { BaseRouter } from './baseRouter';

import { User } from '../../shared/models/user';
import { ResponseError } from '../errors/responseError';

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
      res.json({ login: false });
      //res.redirect('/');
    });

    router.get("/status", (req: Request, res: Response) => {
      // `req.user` contains the authenticated user.
      res.json({ login: req.isAuthenticated() });
    });

    // POST /auth/google
    router.post('/auth/google', this.loginWithGoogle.bind(this));
  }

  private loginWithGoogle(req: Request, res: Response, next: NextFunction) {
    //Get auth_code from request
    const auth_code = req.body.auth_code;
    this.ctrl.login(auth_code)
      .then((user: User) => {
        console.log("user to sign in?", user);
        //Logging in with the found or new user
        req.login(user, (err: any) => {
          if (err) {
            console.log("loginWithGoogle error: ", err);
            throw new ResponseError(err, "Error in logging user in with passport");
          }
          console.log("safe: ", user);
          let safeUser = this.getClientSafeUser(user);
          console.log("safeUser: ", safeUser);
          this.send(res, safeUser, "Succes logging in with Google")
          //res.json({ login: true, isGoogleUsed: true, message: "ok" });
        });
      })
      .catch((err: any) => {
        let errorMessage = "An unknown error happen"
        if (err instanceof ResponseError) {
          errorMessage = err.message;
        }
        this.errorHandler(res, err, errorMessage);
        //return next(err);
      });
  }
}

// Create the loginRoutes, and export its configured Express.Router
const loginRoutes = new LoginRouter();

export default loginRoutes.router;
