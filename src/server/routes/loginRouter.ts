import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";
import { googleController } from '../controllers/googleController';

const loginRouter: Router = Router();

loginRouter.post("/signup", passport.authenticate('local-signup'),
  (req: Request, res: Response) => {
    // `req.user` contains the authenticated user.
    res.json({ login: true });
  }
);

// login method
loginRouter.post("/", passport.authenticate('local'),
  (req: Request, res: Response) => {
    // `req.user` contains the authenticated user.
    res.json({ login: true });
  }
);

loginRouter.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  res.json({ login: false });
  //res.redirect('/');
});

loginRouter.get("/status", (req: Request, res: Response) => {
  // `req.user` contains the authenticated user.
  res.json({ login: req.isAuthenticated() });
});

// POST /auth/google
loginRouter.post('/auth/google', //passport.authenticate('local-google'),
  new googleController().login
);

export { loginRouter };
