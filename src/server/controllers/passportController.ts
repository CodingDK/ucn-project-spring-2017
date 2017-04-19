import { NextFunction, Request, Response, Router } from "express";

import { UserController } from './userController';
import {UserDocument} from '../models/user';

/**
 * Controller for handling signup and login in the application
 */
export class PassportController {
  private userCtrl: UserController = new UserController();

  /**
   * The method passportJS called then an user tries to login.
   * @param req the request
   * @param email the email of the user
   * @param password the password to check
   * @param done callback then all is done here
   */
  public loginWithPassport(req: any, email: string, password: string, done: any) : void {
    console.log("before looking for user in db, req.user: ", JSON.stringify(req.user));
    console.log("before looking for user in db, email: ", email);
    console.log("this, login?", JSON.stringify(this));
    this.userCtrl.findByEmail(email)
      .then((user: UserDocument) => {
        // if no user is found, return message
        if (!user) {
          console.log("no user found with " + email);
          return done(null, false, {message: "no user found with " + email});
        }

        // if the user exists, we check the password
        if (!user.validPassword(password)) {
          console.log("user password not valid, email: " + email);
          return done(null, false, {message: "wrong password for email: " + email});
        }

        console.log("user logged in", JSON.stringify(user));
        // if everything is ok, return the user
        return done(null, user);
      })
      .catch((err: any) => {
        // If there are any error, return the error
        if (err) {
          console.log("looking for user in db error?, email: ",
            email, "error: ", JSON.stringify(err));
          return done(err);
        }
        return done(err);
      });
  }

  /**
   * The method PassportJS used then an user tries to signup with a new account
   * @param req the request
   * @param email the email of the user
   * @param password the chosen password
   * @param done callback then all is done here
   */
  public signUpWithPassport(req: any, email: string, password: string, done: any) : void {
    this.userCtrl.findByEmail(email)
      .then((user) => {
        // check if the email already exists
        if (user) {
          console.log("user email already created, email: ", email);
          return done(null, false, { message: `That email is already taken: ${email}` });
        } else {
          this.userCtrl.createUser(email, password)
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        }
      });
  }
  
  /** Serializering method for PassportJS */
  public serializeUser(user: UserDocument, done: any) : void {
    console.log("serializeUser", JSON.stringify(user));
    done(null, user._id);
  }

  /** Deserializering method for PassportJS */
  public deserializeUser(id: string, done: any) : void {
    console.log("deserializeUser ID: ", JSON.stringify(id));
    console.log("test, this?", JSON.stringify(this));
    this.userCtrl.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  }
}
