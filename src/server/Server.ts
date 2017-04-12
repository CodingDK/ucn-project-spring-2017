import * as express from 'express';
import * as logger from 'morgan';
import {json, urlencoded} from 'body-parser';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import config from './config/config';

import { loginRouter } from './routes/loginRouter';
import { githubRouter } from './routes/githubRouter';
import HeroRouter from './routes/heroRouter';
import PassportConfig from './config/passportConfig';

import {IDatabase} from './config/iDatabase';
import {MongoDatabase} from './dal/mongoDatabase';

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

    app.use(cors({ origin: config.origin, credentials: true})); //
    app.use(logger('dev'));
    app.use(cookieParser('secretForAll'));
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use(session({
        secret: 'ytunolossabes',
        saveUninitialized: true,
        resave: true
    }));
    PassportConfig.setup(app);
  }

  // Configure API endpoints.
  private routes(): void {
    let app = this.express;
    app.use('/api/github', githubRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/v1/heroes', HeroRouter);
    //app.use(express.static(path.join(__dirname, "/../client")));
  }
}

export default new Server().express;
