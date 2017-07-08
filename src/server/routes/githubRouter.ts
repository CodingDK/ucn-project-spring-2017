import { NextFunction, Request, Response, Router } from "express";
import * as request from "request";

import config from '../config/config';
//import {isLoggedIn} from '../config/common';

function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
    // if user is authenticate in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }
    //res.redirect('/');
    res.send(401, { login: false, text: 'You are not logged in!' });
}

const githubRouter: Router = Router();
githubRouter.get('/commits', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  var options = {
    //url: 'http://localhost:4200/test',
    headers: {
      'User-Agent': 'Application'
    }
  };
  request('https://api.github.com/repos/CodingDK/ucn-project-spring-2017/commits', options, (error: any, response: any, body: any) => {
    if (!error && response.statusCode == 200) {
      if (config.gitHubSimpleCache == "") {
        config.gitHubSimpleCache = body;
      }
      res.type('json');
      res.send(config.gitHubSimpleCache);
    }
  });
});

export { githubRouter };