import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import config from './config/config';
import { JL } from 'jsnlog';
const jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

import { Response, Request, NextFunction } from 'express';


import LoginRouter from './routes/loginRouter';
import { githubRouter } from './routes/githubRouter';
import HeroRouter from './routes/heroRouter';
import LessonRouter from './routes/lessonRouter';
import UserRoutes from './routes/userRouter';
import PassportConfig from './config/passportConfig';
import StudentRouter from './routes/StudentRouter'; // TODO: merge with lesson routes

import { IDatabase } from './interfaces/dal/iDatabase';
import { MongoDatabase } from './dal/mongoDatabase';

import { ValidationError } from 'class-validator';
import { ResponseError } from './errors/responseError';

/**
 * Class for handling the server (expressJS instance)
 */
class Server {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.errorHandler();
  }
  // Configure Express middleware.
  private middleware(): void {
    const app = this.express;
    const dbHandler: IDatabase = new MongoDatabase();
    // open connection to Database
    dbHandler.openConnection(config.db.development);
    // If the Node process ends, close the database connection
    process.on('SIGINT', dbHandler.closeConnectionEvent);
    process.on('SIGTERM', dbHandler.closeConnectionEvent);


    app.use(compression());
    app.use(cors({ origin: config.origin, credentials: true})); //
    app.use(morgan('dev'));
    app.use(cookieParser(config.cookie.secret));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    });

    app.use(session({
        secret: config.session.secret,
        saveUninitialized: false,
        resave: false,
        cookie: { httpOnly: true }, //, maxAge: 2419200000 },
        store: dbHandler.getStoreForSessions()
    }));
    PassportConfig.setup(app);

    JL().setOptions({ "appenders": [dbHandler.getJSNLogAppenderForErrorLogging(config.db.development)] });
  }

  // Configure API endpoints.
  private routes(): void {
    const app = this.express;
    app.use('/api/github', githubRouter);
    app.use('/api/login', LoginRouter);
    app.use('/api/v1/heroes', HeroRouter);
    app.use('/api/lesson/', LessonRouter);
    app.use('/api/user/', UserRoutes);
    app.use('/api/student/', StudentRouter); // TODO: merge with lesson routes


    // jsnlog.js on the client by default sends log messages to /jsnlog.logger, using POST.
    app.post('*.logger', function (req, res) {
      jsnlog_nodejs(JL, req.body);
      // Send empty response. This is ok, because client side jsnlog does not use response from server.
      res.send('');
    });
    //app.use(express.static(path.join(__dirname, "/../client")));
  }

  private errorHandler(): void {
    this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.log("errorHandler in server.ts");
      console.error(err.stack);
      let data = err;
      let unknownErorr = true;
      let errorName;
      try {
        errorName = err.constructor.name;
      } catch (e) { }
      //check if parentError is validationErrors and send them as data object instead
      if (err instanceof ResponseError) {
        unknownErorr = false;
        const parent = err.getParentError();
        if (typeof parent[0] !== 'undefined' && parent[0] instanceof ValidationError) {
          data = parent;
          errorName = "ValidationError";
          JL('onValidationError').info(parent);
        } else {
          JL('onResponseError').error(err);
        }
      } else {
        JL('onServerError').fatal(err);
      }

      return res.status(400).json({
        data: data,
        message: data.message,
        succus: false,
        errorName: errorName,
        errorCode: err.code,
        unknownErorr: unknownErorr ? true : undefined
      });
    });
  }
}

export default new Server().express;
