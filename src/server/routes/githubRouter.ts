import { NextFunction, Request, Response, Router } from "express";
import * as request from "request";

import config from '../config/config';
import {isLoggedIn} from '../config/common';

const githubRouter: Router = Router();
githubRouter.get('/commits', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  var options = {
    //url: 'http://localhost:4200/test',
    headers: {
      'User-Agent': 'Application'
    }
  };
  request('https://api.github.com/repos/CodingDK/TypeScript-Express/commits', options, (error: any, response: any, body: any) => {
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