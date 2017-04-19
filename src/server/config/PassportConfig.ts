import {Application} from 'express';
import * as passport from "passport";
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import {UserDocument} from '../models/user';
import { LoginController } from '../controllers/loginController';
import config from '../config/config';

/**
 * This class make the setup for PassportJS in the application
 */
export default class PassportConfig {
  private ctrl: LoginController = new LoginController();

  constructor(private app: Application) {
    this.init();
  }

  /**
   * Method for setup PassportJS in the application
   * @param app the application instance of express
   */
  public static setup(app: Application) {
    return new PassportConfig(app);
  }


  private init(): void {
    // ====================== //
    // passport session setup //
    // ====================== //
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser((user: UserDocument, done) => {
      this.ctrl.serializeUser(user, done);
    });

    // used to deserialize the user
    passport.deserializeUser((id: string, done: any) => {
      this.ctrl.deserializeUser(id, done);
    });

    // ============ //
    // LOCAL SIGNUP //
    // ============ //

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req: any, email: string, password: string, done: any) => {
        // async
        process.nextTick(() => {
          this.ctrl.signUpWithPassport(req, email, password, done);
        });
      })
    );

    // =========== //
    // LOCAL LOGIN //
    // =========== //
    // We create another strategy for the login process

    passport.use(new LocalStrategy({
        // change default username for email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req: any, email: string, password: string, done: any) => {
        this.ctrl.loginWithPassport(req, email, password, done);
      })
    );

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.

    const google = config.oauth.google;
    passport.use(new GoogleStrategy({
        clientID: google.clientId,
        clientSecret: google.clientSecret,
        callbackURL: google.callbackUrl
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        this.ctrl.loginWithGooglePassport(accessToken, refreshToken, profile, done);
      }
    ));

    // passport setup
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
