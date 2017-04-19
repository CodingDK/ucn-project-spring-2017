import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";

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

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
loginRouter.get('/auth/google',
  passport.authenticate('google'
    , { scope: ['profile'] }
    )
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
loginRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: any, res: any) => {
    res.json({ login: "WEE" });
    //res.redirect('/');
  }
);

export { loginRouter };
